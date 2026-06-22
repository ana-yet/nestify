import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Property from "../models/Property.js";
import mongoose from "mongoose";

// Helper: update property average rating
const updatePropertyRating = async (propertyId) => {
  const objectId = new mongoose.Types.ObjectId(propertyId);
  const [stats] = await Review.aggregate([
    { $match: { propertyId: objectId } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await Property.findByIdAndUpdate(propertyId, {
    averageRating: stats?.avg ? Math.round(stats.avg * 10) / 10 : 0,
    reviewCount: stats?.count || 0,
  });
};

// GET /reviews/featured
export const getFeaturedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .sort({ rating: -1, createdAt: -1 })
      .limit(4)
      .populate("propertyId", "title location images");

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// GET /reviews/property/:propertyId
export const getPropertyReviews = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const reviews = await Review.find({ propertyId })
      .sort({ createdAt: -1 })
      .lean();

    let userReview = null;
    let canReview = false;

    if (req.user?.role === "tenant") {
      userReview = await Review.findOne({
        propertyId,
        userId: req.user.userId,
      }).lean();
      if (!userReview) {
        const booking = await Booking.findOne({
          tenantId: req.user.userId,
          propertyId,
          bookingStatus: "approved",
          paymentStatus: "paid",
        });
        canReview = Boolean(booking);
      }
    }

    res
      .status(200)
      .json({ success: true, data: { reviews, userReview, canReview } });
  } catch (error) {
    next(error);
  }
};

// POST /reviews
export const createReview = async (req, res, next) => {
  try {
    const { propertyId, rating, comment } = req.body;

    // Must have approved + paid booking
    const booking = await Booking.findOne({
      tenantId: req.user.userId,
      propertyId,
      bookingStatus: "approved",
      paymentStatus: "paid",
    });
    if (!booking) {
      return res.status(403).json({
        success: false,
        message: "You need an approved booking to review",
      });
    }

    // Check duplicate
    const existing = await Review.findOne({
      userId: req.user.userId,
      propertyId,
    });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Already reviewed" });
    }

    const user = await User.findById(req.user.userId).select("name email");

    const review = await Review.create({
      propertyId,
      userId: req.user.userId,
      bookingId: booking._id,
      rating,
      comment: comment.trim(),
      userSnapshot: { name: user.name, email: user.email },
    });

    await updatePropertyRating(propertyId);

    res
      .status(201)
      .json({ success: true, message: "Review submitted", data: { review } });
  } catch (error) {
    next(error);
  }
};

// PATCH /reviews/:id
export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    if (review.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.comment) review.comment = req.body.comment.trim();
    await review.save();
    await updatePropertyRating(review.propertyId);

    res
      .status(200)
      .json({ success: true, message: "Review updated", data: { review } });
  } catch (error) {
    next(error);
  }
};

// DELETE /reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    if (review.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const propertyId = review.propertyId;
    await Review.findByIdAndDelete(req.params.id);
    await updatePropertyRating(propertyId);

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};
