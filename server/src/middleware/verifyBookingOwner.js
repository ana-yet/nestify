import Booking from '../models/Booking.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

export const verifyBookingOwner = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.ownerId.toString() !== req.user.userId) {
    throw new ApiError(403, 'You can only manage bookings for your own properties');
  }

  req.booking = booking;
  next();
});

export default verifyBookingOwner;
