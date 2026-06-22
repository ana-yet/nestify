import Favorite from '../models/Favorite.js';

export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'propertyId',
        match: { status: 'approved' },
        select: 'title location images rent rentType propertyType bedrooms bathrooms averageRating',
      });

    // Filter out null populated results (unapproved properties)
    const validFavorites = favorites.filter((f) => f.propertyId);

    res.status(200).json({ success: true, data: validFavorites });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.body;

    const existing = await Favorite.findOne({ userId: req.user.userId, propertyId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Already in favorites' });
    }

    const favorite = await Favorite.create({ userId: req.user.userId, propertyId });
    res.status(201).json({ success: true, message: 'Added to favorites', data: { favorite } });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    await Favorite.findOneAndDelete({
      userId: req.user.userId,
      propertyId: req.params.propertyId,
    });

    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

export const checkFavorite = async (req, res, next) => {
  try {
    const fav = await Favorite.findOne({
      userId: req.user.userId,
      propertyId: req.params.propertyId,
    });

    res.status(200).json({ success: true, data: { isFavorite: Boolean(fav) } });
  } catch (error) {
    next(error);
  }
};
