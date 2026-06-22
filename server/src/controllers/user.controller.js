import User from '../models/User.js';

// GET /users/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: { user: user.toPublicJSON() } });
  } catch (error) {
    next(error);
  }
};

// PATCH /users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, photo, phone } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name.trim();
    if (photo !== undefined) user.photo = photo;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    res.status(200).json({ success: true, message: 'Profile updated', data: { user: user.toPublicJSON() } });
  } catch (error) {
    next(error);
  }
};
