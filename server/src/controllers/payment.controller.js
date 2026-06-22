import { getStripe } from "../config/stripe.js";
import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";

const clientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";

// POST /payments/create-checkout-session
export const createSession = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "bookingId is required" });
    }

    const booking = await Booking.findById(bookingId).populate(
      "propertyId",
      "title",
    );
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    if (booking.tenantId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ success: false, message: "Already paid" });
    }

    const stripe = getStripe();
    const amountInCents = Math.round(booking.amount * 100);
    const propertyTitle = booking.propertyId?.title || "Property Reservation";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amountInCents,
            product_data: {
              name: `Nestify Reservation — ${propertyTitle}`,
              description: "Property booking reservation fee",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        tenantId: booking.tenantId.toString(),
        ownerId: booking.ownerId.toString(),
        propertyId: booking.propertyId._id.toString(),
      },
      success_url: `${clientUrl()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl()}/payment/cancel?bookingId=${booking._id}`,
    });

    booking.stripeSessionId = session.id;
    await booking.save();

    res.status(200).json({
      success: true,
      data: { sessionId: session.id, url: session.url },
    });
  } catch (error) {
    next(error);
  }
};

// POST /payments/webhook (called before JSON parser)
export const handleWebhook = async (req, res) => {
  try {
    const stripe = getStripe();
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res
        .status(500)
        .json({ success: false, message: "Webhook secret not configured" });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.payment_status === "paid") {
        // Check for duplicate
        const existing = await Transaction.findOne({
          stripeSessionId: session.id,
        });
        if (!existing) {
          const booking = await Booking.findById(session.metadata.bookingId);
          if (booking && booking.paymentStatus !== "paid") {
            const paymentIntentId =
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id;

            const transaction = await Transaction.create({
              bookingId: booking._id,
              propertyId: booking.propertyId,
              tenantId: booking.tenantId,
              ownerId: booking.ownerId,
              stripePaymentIntentId: paymentIntentId,
              stripeSessionId: session.id,
              amount: booking.amount,
              currency: "usd",
              status: "succeeded",
              paidAt: new Date(),
              metadata: session.metadata || {},
            });

            booking.paymentStatus = "paid";
            booking.stripeSessionId = session.id;
            booking.stripePaymentIntentId = paymentIntentId;
            booking.transactionId = transaction._id;
            await booking.save();
          }
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res
      .status(400)
      .json({ success: false, message: `Webhook error: ${error.message}` });
  }
};

// GET /payments/verify/:sessionId
export const verifyPayment = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.tenantId !== req.user.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const booking = await Booking.findById(
      session.metadata?.bookingId,
    ).populate("propertyId", "title location images rent rentType");

    let transaction = null;
    if (booking) {
      transaction = await Transaction.findOne({ bookingId: booking._id });
    }

    res.status(200).json({
      success: true,
      data: {
        booking,
        paymentStatus: booking?.paymentStatus || "unknown",
        stripePaymentStatus: session.payment_status,
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};
