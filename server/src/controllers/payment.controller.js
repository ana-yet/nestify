import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import { getStripe } from '../config/stripe.js';
import {
  createCheckoutSession,
  verifyPaymentSession,
  processCheckoutCompleted,
} from '../services/stripe.service.js';

export const createSession = catchAsync(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    throw new ApiError(400, 'bookingId is required');
  }

  const result = await createCheckoutSession({
    bookingId,
    tenantId: req.user.userId,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const handleWebhook = catchAsync(async (req, res) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new ApiError(500, 'STRIPE_WEBHOOK_SECRET is not configured');
  }

  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    throw new ApiError(400, `Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      await processCheckoutCompleted(session);
    }
  }

  res.status(200).json({ received: true });
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { sessionId } = req.params;

  const result = await verifyPaymentSession({
    sessionId,
    tenantId: req.user.userId,
  });

  res.status(200).json({
    success: true,
    data: {
      booking: result.booking,
      paymentStatus: result.paymentStatus,
      stripePaymentStatus: result.stripePaymentStatus,
      transaction: result.transaction,
    },
  });
});
