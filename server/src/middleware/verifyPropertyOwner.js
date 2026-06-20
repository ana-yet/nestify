import Property from '../models/Property.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const verifyPropertyOwnerOrAdmin = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  const isOwner = property.ownerId.toString() === req.user.userId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You do not have permission to modify this property');
  }

  req.property = property;
  next();
});

export default verifyPropertyOwnerOrAdmin;
