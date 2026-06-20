import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const getProfile = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.userDoc.toPublicJSON() },
  });
});

export const updateProfile = catchAsync(async (req, res) => {
  const { name, photo, phone } = req.body;
  const user = req.userDoc;

  if (name !== undefined) user.name = name.trim();
  if (photo !== undefined) user.photo = photo.trim();
  if (phone !== undefined) user.phone = phone.trim();

  if (!user.name) {
    throw new ApiError(400, 'Name cannot be empty');
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: user.toPublicJSON() },
  });
});
