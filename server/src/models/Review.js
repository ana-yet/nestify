import mongoose from 'mongoose';

const userSnapshotSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      maxlength: 2000,
    },
    userSnapshot: {
      type: userSnapshotSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ propertyId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
