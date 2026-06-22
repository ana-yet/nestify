import Property from "../models/Property.js";
import Booking from "../models/Booking.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

const serializeBooking = (doc) => (doc.toObject ? doc.toObject() : doc);

export const createBooking = catchAsync(async (req, res) => {
  const { propertyId, moveInDate, contactNumber, tenantInfo, additionalNotes } =
    req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, "Property not found");
  }
  if (property.status !== "approved") {
    throw new ApiError(400, "This property is not available for booking");
  }
  if (property.ownerId.toString() === req.user.userId) {
    throw new ApiError(400, "You cannot book your own property");
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
    additionalNotes: additionalNotes || "",
    bookingStatus: "pending",
    paymentStatus: "unpaid",
    amount: property.rent,
    currency: "usd",
  });

  await booking.populate("propertyId", "title location images rent rentType");

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: { booking: serializeBooking(booking) },
  });
});

export const getMyBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ tenantId: req.user.userId })
    .sort({ createdAt: -1 })
    .populate("propertyId", "title location images rent rentType");

  res.status(200).json({
    success: true,
    data: bookings.map(serializeBooking),
  });
});

export const getOwnerBookingRequests = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ ownerId: req.user.userId })
    .sort({ createdAt: -1 })
    .populate("propertyId", "title location images rent rentType")
    .populate("tenantId", "name email photo phone");

  res.status(200).json({
    success: true,
    data: bookings.map(serializeBooking),
  });
});

export const getBookingById = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("propertyId", "title location images rent rentType ownerInfo")
    .populate("tenantId", "name email photo phone");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const userId = req.user.userId;
  const isTenant = booking.tenantId._id
    ? booking.tenantId._id.toString() === userId
    : booking.tenantId.toString() === userId;
  const isOwner = booking.ownerId.toString() === userId;
  const isAdmin = req.user.role === "admin";

  if (!isTenant && !isOwner && !isAdmin) {
    throw new ApiError(403, "You do not have access to this booking");
  }

  res.status(200).json({
    success: true,
    data: { booking: serializeBooking(booking) },
  });
});

export const approveBooking = catchAsync(async (req, res) => {
  const booking = req.booking;

  if (booking.paymentStatus !== "paid") {
    throw new ApiError(400, "Booking must be paid before approval");
  }

  if (booking.bookingStatus === "approved") {
    throw new ApiError(400, "Booking is already approved");
  }

  if (booking.bookingStatus === "rejected") {
    throw new ApiError(400, "Cannot approve a rejected booking");
  }

  booking.bookingStatus = "approved";
  await booking.save();

  await booking.populate("propertyId", "title location images rent rentType");
  await booking.populate("tenantId", "name email photo phone");

  res.status(200).json({
    success: true,
    message: "Booking approved",
    data: { booking: serializeBooking(booking) },
  });
});

export const rejectBooking = catchAsync(async (req, res) => {
  const booking = req.booking;
  const { rejectedReason } = req.body;

  if (booking.bookingStatus === "rejected") {
    throw new ApiError(400, "Booking is already rejected");
  }

  if (booking.bookingStatus === "approved") {
    throw new ApiError(400, "Cannot reject an approved booking");
  }

  if (booking.paymentStatus === "paid") {
    throw new ApiError(
      400,
      "Cannot reject a booking that has already been paid",
    );
  }

  booking.bookingStatus = "rejected";
  if (rejectedReason) {
    booking.rejectedReason = rejectedReason.trim();
  }
  await booking.save();

  await booking.populate("propertyId", "title location images rent rentType");
  await booking.populate("tenantId", "name email photo phone");

  res.status(200).json({
    success: true,
    message: "Booking rejected",
    data: { booking: serializeBooking(booking) },
  });
});
