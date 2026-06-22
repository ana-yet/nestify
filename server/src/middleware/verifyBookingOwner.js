import Booking from '../models/Booking.js';

const verifyBookingOwner = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    req.booking = booking;
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyBookingOwner;
