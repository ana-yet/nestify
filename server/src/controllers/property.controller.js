import Property from '../models/Property.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import {
  buildPropertyFilter,
  buildSortOption,
  parsePagination,
  formatPagination,
} from '../services/propertyQuery.service.js';
import { pickAllowedPropertyFields } from '../utils/propertyFields.js';

const serializeProperty = (doc) => {
  const property = doc.toObject ? doc.toObject() : doc;
  return property;
};

export const createProperty = catchAsync(async (req, res) => {
  const owner = req.userDoc;

  const property = await Property.create({
    ...pickAllowedPropertyFields(req.body),
    status: 'pending',
    ownerId: owner._id,
    ownerInfo: {
      name: owner.name,
      email: owner.email,
      photo: owner.photo || '',
    },
    rejectionFeedback: '',
  });

  res.status(201).json({
    success: true,
    message: 'Property submitted for approval',
    data: { property: serializeProperty(property) },
  });
});

export const getProperties = catchAsync(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = buildPropertyFilter(req.query, { forceApproved: true });
  const sort = buildSortOption(req.query.sort);

  const [properties, total] = await Promise.all([
    Property.find(filter).sort(sort).skip(skip).limit(limit),
    Property.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: properties.map(serializeProperty),
    pagination: formatPagination(page, limit, total),
  });
});

export const getFeaturedProperties = catchAsync(async (req, res) => {
  const properties = await Property.find({ status: 'approved' })
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(6);

  res.status(200).json({
    success: true,
    data: properties.map(serializeProperty),
  });
});

export const getRecentProperties = catchAsync(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 4, 12);
  const properties = await Property.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    data: properties.map(serializeProperty),
  });
});

export const getTopLocations = catchAsync(async (req, res) => {
  const locations = await Property.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: '$location.city',
        count: { $sum: 1 },
        state: { $first: '$location.state' },
        avgRent: { $avg: '$rent' },
        image: { $first: { $arrayElemAt: ['$images', 0] } },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 6 },
    {
      $project: {
        _id: 0,
        city: '$_id',
        state: 1,
        count: 1,
        avgRent: { $round: ['$avgRent', 0] },
        image: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: locations,
  });
});

export const getRentalStats = catchAsync(async (req, res) => {
  const [stats] = await Property.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: null,
        totalListings: { $sum: 1 },
        avgRent: { $avg: '$rent' },
        totalCities: { $addToSet: '$location.city' },
        totalOwners: { $addToSet: '$ownerId' },
      },
    },
    {
      $project: {
        _id: 0,
        totalListings: 1,
        avgRent: { $round: ['$avgRent', 0] },
        totalCities: { $size: '$totalCities' },
        totalOwners: { $size: '$totalOwners' },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats || { totalListings: 0, avgRent: 0, totalCities: 0, totalOwners: 0 },
  });
});

export const getPropertyById = catchAsync(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  const isOwner = property.ownerId.toString() === req.user.userId;
  const isAdmin = req.user.role === 'admin';

  if (property.status !== 'approved' && !isOwner && !isAdmin) {
    throw new ApiError(403, 'This property is not available');
  }

  res.status(200).json({
    success: true,
    data: { property: serializeProperty(property) },
  });
});

export const updateProperty = catchAsync(async (req, res) => {
  const property = req.property;
  const isAdmin = req.user.role === 'admin';
  const isOwner = property.ownerId.toString() === req.user.userId;

  const updates = pickAllowedPropertyFields(req.body);

  if (isOwner && !isAdmin) {
    updates.status = 'pending';
    updates.rejectionFeedback = '';
  }

  const updated = await Property.findByIdAndUpdate(property._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Property updated successfully',
    data: { property: serializeProperty(updated) },
  });
});

export const deleteProperty = catchAsync(async (req, res) => {
  await Property.findByIdAndDelete(req.property._id);

  res.status(200).json({
    success: true,
    message: 'Property deleted successfully',
  });
});

export const getOwnerProperties = catchAsync(async (req, res) => {
  const properties = await Property.find({ ownerId: req.user.userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: properties.map(serializeProperty),
  });
});

export const getAdminProperties = catchAsync(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = buildPropertyFilter(req.query, { adminView: true });
  const sort = buildSortOption(req.query.sort || 'newest');

  const [properties, total] = await Promise.all([
    Property.find(filter).sort(sort).skip(skip).limit(limit),
    Property.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: properties.map(serializeProperty),
    pagination: formatPagination(page, limit, total),
  });
});

export const approveProperty = catchAsync(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  property.status = 'approved';
  property.rejectionFeedback = '';
  await property.save();

  res.status(200).json({
    success: true,
    message: 'Property approved',
    data: { property: serializeProperty(property) },
  });
});

export const rejectProperty = catchAsync(async (req, res) => {
  const { rejectionFeedback } = req.body;
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  property.status = 'rejected';
  property.rejectionFeedback = rejectionFeedback.trim();
  await property.save();

  res.status(200).json({
    success: true,
    message: 'Property rejected',
    data: { property: serializeProperty(property) },
  });
});
