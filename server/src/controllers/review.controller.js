import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { updatePropertyRating } from '../services/reviewRating.service.js';

const serializeReview = (doc) => (doc.toObject ? doc.toObject() : doc);

const findApprovedBooking = async (userId, propertyId) =>
  Booking.findOne({
    tenantId: userId,
    propertyId,
    bookingStatus: 'approved',
    paymentStatus: 'paid',
  });

export const getFeaturedReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ rating: { $gte: 4 } })
    .sort({ rating: -1, createdAt: -1 })
    .limit(4)
    .populate('propertyId', 'title location images');

  res.status(200).json({
    success: true,
    data: reviews.map(serializeReview),
  });
});

export const getPropertyReviews = catchAsync(async (req, res) => {
  const { propertyId } = req.params;

  const reviews = await Review.find({ propertyId })
    .sort({ createdAt: -1 })
    .lean();

  let userReview = null;
  let canReview = false;

  if (req.user?.role === 'tenant') {
    userReview = await Review.findOne({
      propertyId,
      userId: req.user.userId,
    }).lean();

    if (!userReview) {
      const approvedBooking = await findApprovedBooking(req.user.userId, propertyId);
      canReview = Boolean(approvedBooking);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      reviews,
      userReview,
      canReview,
    },
  });
});

export const createReview = catchAsync(async (req, res) => {
  const { propertyId, rating, comment } = req.body;

  const approvedBooking = await findApprovedBooking(req.user.userId, propertyId);
  if (!approvedBooking) {
    throw new ApiError(403, 'You must have an approved booking to review this property');
  }

  const existing = await Review.findOne({
    userId: req.user.userId,
    propertyId,
  });

  if (existing) {
    throw new ApiError(409, 'You have already reviewed this property');
  }

  const user = await User.findById(req.user.userId).select('name email');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const review = await Review.create({
    propertyId,
    userId: req.user.userId,
    bookingId: approvedBooking._id,
    rating,
    comment: comment.trim(),
    userSnapshot: {
      name: user.name,
      email: user.email,
    },
  });

  await updatePropertyRating(propertyId);

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: { review: serializeReview(review) },
  });
});

export const updateReview = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  if (review.userId.toString() !== req.user.userId) {
    throw new ApiError(403, 'You can only edit your own reviews');
  }

  const { rating, comment } = req.body;

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment.trim();

  await review.save();
  await updatePropertyRating(review.propertyId);

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: { review: serializeReview(review) },
  });
});

export const deleteReview = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  if (review.userId.toString() !== req.user.userId) {
    throw new ApiError(403, 'You can only delete your own reviews');
  }

  const { propertyId } = review;
  await review.deleteOne();
  await updatePropertyRating(propertyId);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});
