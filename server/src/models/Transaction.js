import mongoose from 'mongoose';

const TRANSACTION_STATUSES = ['succeeded', 'pending', 'failed', 'refunded'];

const transactionSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    status: {
      type: String,
      enum: TRANSACTION_STATUSES,
      default: 'succeeded',
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

transactionSchema.index({ ownerId: 1, paidAt: -1 });
transactionSchema.index({ tenantId: 1, paidAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export { TRANSACTION_STATUSES };
export default Transaction;
