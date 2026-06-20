import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';
import Property from '../models/Property.js';
import ApiError from '../utils/ApiError.js';
import { getStripe } from '../config/stripe.js';

const clientUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';

export const createCheckoutSession = async ({ bookingId, tenantId }) => {
  const booking = await Booking.findById(bookingId).populate(
    'propertyId',
    'title images location'
  );

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.tenantId.toString() !== tenantId) {
    throw new ApiError(403, 'You do not have access to this booking');
  }

  if (booking.paymentStatus === 'paid') {
    throw new ApiError(400, 'This booking has already been paid');
  }

  const stripe = getStripe();
  const amountInCents = Math.round(booking.amount * 100);

  if (amountInCents < 50) {
    throw new ApiError(400, 'Payment amount is too low');
  }

  const propertyTitle = booking.propertyId?.title || 'Property Reservation';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: booking.currency || 'usd',
          unit_amount: amountInCents,
          product_data: {
            name: `Nestify Reservation — ${propertyTitle}`,
            description: 'Property booking reservation fee',
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking._id.toString(),
      tenantId: booking.tenantId.toString(),
      ownerId: booking.ownerId.toString(),
      propertyId: (booking.propertyId._id || booking.propertyId).toString(),
    },
    success_url: `${clientUrl()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl()}/payment/cancel?bookingId=${booking._id.toString()}`,
  });

  booking.stripeSessionId = session.id;
  await booking.save();

  return { sessionId: session.id, url: session.url };
};

export const processCheckoutCompleted = async (session) => {
  const existingTransaction = await Transaction.findOne({
    stripeSessionId: session.id,
  });

  if (existingTransaction) {
    return { alreadyProcessed: true, transaction: existingTransaction };
  }

  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    throw new ApiError(400, 'Missing bookingId in Stripe session metadata');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found for webhook session');
  }

  if (booking.paymentStatus === 'paid' && booking.transactionId) {
    const txn = await Transaction.findById(booking.transactionId);
    return { alreadyProcessed: true, transaction: txn };
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paymentIntentId) {
    throw new ApiError(400, 'Missing payment intent on completed session');
  }

  const duplicateIntent = await Transaction.findOne({ stripePaymentIntentId: paymentIntentId });
  if (duplicateIntent) {
    return { alreadyProcessed: true, transaction: duplicateIntent };
  }

  const transaction = await Transaction.create({
    bookingId: booking._id,
    propertyId: booking.propertyId,
    tenantId: booking.tenantId,
    ownerId: booking.ownerId,
    stripePaymentIntentId: paymentIntentId,
    stripeSessionId: session.id,
    amount: booking.amount,
    currency: booking.currency || 'usd',
    status: 'succeeded',
    paidAt: new Date(),
    metadata: session.metadata || {},
  });

  booking.paymentStatus = 'paid';
  booking.stripeSessionId = session.id;
  booking.stripePaymentIntentId = paymentIntentId;
  booking.transactionId = transaction._id;
  await booking.save();

  return { alreadyProcessed: false, transaction, booking };
};

export const verifyPaymentSession = async ({ sessionId, tenantId }) => {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.metadata?.tenantId !== tenantId) {
    throw new ApiError(403, 'You do not have access to this payment session');
  }

  const booking = await Booking.findById(session.metadata?.bookingId)
    .populate('propertyId', 'title location images rent rentType');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  let transaction = await Transaction.findOne({ stripeSessionId: session.id });

  if (!transaction && session.payment_status === 'paid') {
    const result = await processCheckoutCompleted(session);
    transaction = result.transaction;
  }

  return {
    booking,
    paymentStatus: booking.paymentStatus,
    stripePaymentStatus: session.payment_status,
    transaction,
  };
};
