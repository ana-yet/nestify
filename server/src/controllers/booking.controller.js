import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

export const createBooking = async (req, res, next) => {
  try {
    const { propertyId, moveInDate, contactNumber, tenantInfo, additionalNotes } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    if (property.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Property not available for booking' });
    }
    if (property.ownerId.toString() === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Cannot book your own property' });
    }

    const tenant = req.userDoc;
    const booking = await Booking.create({
      propertyId: property._id,
      tenantId: tenant._id,
      ownerId: property.ownerId,
      moveInDate: new Date(moveInDate),
      contactNumber,
      tenantInfo: {
        name: tenantInfo?.name || tenant.name,
        email: tenantInfo?.email || tenant.email,
      },
      additionalNotes: additionalNotes || '',
      bookingStatus: 'pending',
      paymentStatus: 'unpaid',
      amount: property.rent,
      currency: 'usd',
    });

    await booking.populate('propertyId', 'title location images rent rentType');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ tenantId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('propertyId', 'title location images rent rentType');

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const getOwnerBookingRequests = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('propertyId', 'title location images rent rentType')
      .populate('tenantId', 'name email photo phone');

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('propertyId', 'title location images rent rentType ownerInfo')
      .populate('tenantId', 'name email photo phone');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Only tenant, owner, or admin can view
    const userId = req.user.userId;
    const isTenant = booking.tenantId._id
      ? booking.tenantId._id.toString() === userId
      : booking.tenantId.toString() === userId;
    const isOwner = booking.ownerId.toString() === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isTenant && !isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const approveBooking = async (req, res, next) => {
  try {
    const booking = req.booking;

    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ success: false, message: 'Booking must be paid before approval' });
    }
    if (booking.bookingStatus === 'approved') {
      return res.status(400).json({ success: false, message: 'Already approved' });
    }
    if (booking.bookingStatus === 'rejected') {
      return res.status(400).json({ success: false, message: 'Cannot approve a rejected booking' });
    }

    booking.bookingStatus = 'approved';
    await booking.save();
    await booking.populate('propertyId', 'title location images rent rentType');
    await booking.populate('tenantId', 'name email photo phone');

    res.status(200).json({ success: true, message: 'Booking approved', data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const rejectBooking = async (req, res, next) => {
  try {
    const booking = req.booking;
    const { rejectedReason } = req.body;

    if (booking.bookingStatus === 'rejected') {
      return res.status(400).json({ success: false, message: 'Already rejected' });
    }
    if (booking.bookingStatus === 'approved') {
      return res.status(400).json({ success: false, message: 'Cannot reject an approved booking' });
    }

    booking.bookingStatus = 'rejected';
    booking.rejectedReason = rejectedReason || '';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking rejected', data: { booking } });
  } catch (error) {
    next(error);
  }
};
