import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';
import Property from '../models/Property.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { parsePagination, formatPagination } from '../services/propertyQuery.service.js';

const VALID_ROLES = ['tenant', 'owner', 'admin'];

export const getAllUsers = catchAsync(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: users.map((user) => user.toPublicJSON()),
    pagination: formatPagination(page, limit, total),
  });
});

export const getAllBookings = catchAsync(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [bookings, total] = await Promise.all([
    Booking.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('propertyId', 'title location')
      .populate('tenantId', 'name email')
      .populate('ownerId', 'name email'),
    Booking.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: bookings.map((b) => (b.toObject ? b.toObject() : b)),
    pagination: formatPagination(page, limit, total),
  });
});

export const getAllTransactions = catchAsync(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { search } = req.query;

  let filter = {};

  if (search?.trim()) {
    const term = search.trim();
    const regex = new RegExp(term, 'i');

    const [properties, users] = await Promise.all([
      Property.find({ title: regex }).select('_id'),
      User.find({ $or: [{ name: regex }, { email: regex }] }).select('_id'),
    ]);

    const propertyIds = properties.map((p) => p._id);
    const userIds = users.map((u) => u._id);

    const orConditions = [
      { propertyId: { $in: propertyIds } },
      { tenantId: { $in: userIds } },
      { ownerId: { $in: userIds } },
      { stripePaymentIntentId: regex },
      { stripeSessionId: regex },
    ];

    if (/^[a-f\d]{24}$/i.test(term)) {
      orConditions.push({ _id: term });
    }

    filter = { $or: orConditions };
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ paidAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('propertyId', 'title')
      .populate('tenantId', 'name email')
      .populate('ownerId', 'name email'),
    Transaction.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: transactions.map((t) => (t.toObject ? t.toObject() : t)),
    pagination: formatPagination(page, limit, total),
  });
});

export const updateUserRole = catchAsync(async (req, res) => {
  const { role } = req.body;

  if (!VALID_ROLES.includes(role)) {
    throw new ApiError(400, 'Invalid role. Must be tenant, owner, or admin');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (req.params.id === req.user.userId && req.user.role === 'admin' && role !== 'admin') {
    throw new ApiError(403, 'You cannot demote yourself from admin');
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: { user: user.toPublicJSON() },
  });
});
