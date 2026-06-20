import Favorite from '../models/Favorite.js';
import Property from '../models/Property.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const getFavorites = catchAsync(async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user.userId })
    .sort({ createdAt: -1 })
    .populate({
      path: 'propertyId',
      match: { status: 'approved' },
    });

  const data = favorites
    .filter((fav) => fav.propertyId)
    .map((fav) => ({
      _id: fav._id,
      propertyId: fav.propertyId._id,
      createdAt: fav.createdAt,
      property: fav.propertyId,
    }));

  res.status(200).json({
    success: true,
    data,
  });
});

export const addFavorite = catchAsync(async (req, res) => {
  const { propertyId } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }
  if (property.status !== 'approved') {
    throw new ApiError(400, 'Only approved properties can be favorited');
  }

  const existing = await Favorite.findOne({
    userId: req.user.userId,
    propertyId,
  });

  if (existing) {
    throw new ApiError(409, 'Property is already in your favorites');
  }

  const favorite = await Favorite.create({
    userId: req.user.userId,
    propertyId,
  });

  res.status(201).json({
    success: true,
    message: 'Property added to favorites',
    data: { favoriteId: favorite._id, propertyId },
  });
});

export const removeFavorite = catchAsync(async (req, res) => {
  const { propertyId } = req.params;

  const favorite = await Favorite.findOneAndDelete({
    userId: req.user.userId,
    propertyId,
  });

  if (!favorite) {
    throw new ApiError(404, 'Favorite not found');
  }

  res.status(200).json({
    success: true,
    message: 'Property removed from favorites',
  });
});

export const checkFavorite = catchAsync(async (req, res) => {
  const { propertyId } = req.params;

  const favorite = await Favorite.findOne({
    userId: req.user.userId,
    propertyId,
  });

  res.status(200).json({
    success: true,
    data: { isFavorited: Boolean(favorite) },
  });
});
