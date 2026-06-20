import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const verifyJWT = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      throw new ApiError(401, 'User not found or inactive');
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    req.userDoc = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Invalid or expired token');
  }
});

export default verifyJWT;
