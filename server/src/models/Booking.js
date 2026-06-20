import mongoose from 'mongoose';

const BOOKING_STATUSES = ['pending', 'approved', 'rejected'];
const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded', 'failed'];

const tenantInfoSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
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
    moveInDate: {
      type: Date,
      required: [true, 'Move-in date is required'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    tenantInfo: {
      type: tenantInfoSchema,
      required: true,
    },
    additionalNotes: {
      type: String,
      default: '',
      trim: true,
    },
    bookingStatus: {
      type: String,
      enum: BOOKING_STATUSES,
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: 'unpaid',
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
    stripeSessionId: {
      type: String,
      default: null,
      sparse: true,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
      sparse: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
    },
    rejectedReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ tenantId: 1, createdAt: -1 });
bookingSchema.index({ ownerId: 1, bookingStatus: 1 });
bookingSchema.index({ propertyId: 1 });
bookingSchema.index({ stripeSessionId: 1 }, { unique: true, sparse: true });

const Booking = mongoose.model('Booking', bookingSchema);

export { BOOKING_STATUSES, PAYMENT_STATUSES };
export default Booking;
