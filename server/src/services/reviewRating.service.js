import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Property from '../models/Property.js';

export const updatePropertyRating = async (propertyId) => {
  const objectId = new mongoose.Types.ObjectId(propertyId);

  const [stats] = await Review.aggregate([
    { $match: { propertyId: objectId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats?.averageRating
    ? Math.round(stats.averageRating * 10) / 10
    : 0;
  const reviewCount = stats?.reviewCount || 0;

  await Property.findByIdAndUpdate(propertyId, { averageRating, reviewCount });

  return { averageRating, reviewCount };
};

export default updatePropertyRating;
