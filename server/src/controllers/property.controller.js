import Property from '../models/Property.js';

const ALLOWED_FIELDS = [
  'title', 'description', 'location', 'propertyType', 'rent', 'rentType',
  'bedrooms', 'bathrooms', 'propertySize', 'amenities', 'extraFeatures', 'images',
];

const pickFields = (body) => {
  const result = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
};

// Build MongoDB filter from query params
const buildFilter = (query, options = {}) => {
  const filter = {};
  if (options.forceApproved) filter.status = 'approved';
  if (options.ownerId) filter.ownerId = options.ownerId;
  if (options.adminView && query.status) filter.status = query.status;

  if (query.location) {
    const regex = new RegExp(query.location.trim(), 'i');
    filter.$or = [
      { 'location.city': regex },
      { 'location.state': regex },
      { 'location.address': regex },
    ];
  }

  if (query.propertyType) {
    const types = query.propertyType.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    filter.propertyType = types.length === 1 ? types[0] : { $in: types };
  }

  if (query.minPrice || query.maxPrice) {
    filter.rent = {};
    if (query.minPrice) filter.rent.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.rent.$lte = Number(query.maxPrice);
  }

  if (query.bedrooms) filter.bedrooms = { $gte: Number(query.bedrooms) };
  if (query.bathrooms) filter.bathrooms = { $gte: Number(query.bathrooms) };

  return filter;
};

// Build sort object
const buildSort = (sortKey) => {
  const map = {
    price_asc: { rent: 1 },
    price_desc: { rent: -1 },
    newest: { createdAt: -1 },
    rating: { averageRating: -1, reviewCount: -1 },
  };
  return map[sortKey] || map.newest;
};

// Parse pagination params
const parsePage = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 12));
  return { page, limit, skip: (page - 1) * limit };
};

// POST /properties
export const createProperty = async (req, res, next) => {
  try {
    const owner = req.userDoc;
    const property = await Property.create({
      ...pickFields(req.body),
      status: 'pending',
      ownerId: owner._id,
      ownerInfo: { name: owner.name, email: owner.email, photo: owner.photo || '' },
      rejectionFeedback: '',
    });

    res.status(201).json({
      success: true,
      message: 'Property submitted for approval',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

// GET /properties
export const getProperties = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePage(req.query);
    const filter = buildFilter(req.query, { forceApproved: true });
    const sort = buildSort(req.query.sort);

    const [properties, total] = await Promise.all([
      Property.find(filter).sort(sort).skip(skip).limit(limit),
      Property.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /properties/featured
export const getFeaturedProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: 'approved' })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(6);

    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};

// GET /properties/recent
export const getRecentProperties = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 4, 12);
    const properties = await Property.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};

// GET /properties/top-locations
export const getTopLocations = async (req, res, next) => {
  try {
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
          _id: 0, city: '$_id', state: 1, count: 1,
          avgRent: { $round: ['$avgRent', 0] }, image: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: locations });
  } catch (error) {
    next(error);
  }
};

// GET /properties/stats
export const getRentalStats = async (req, res, next) => {
  try {
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
          _id: 0, totalListings: 1,
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
  } catch (error) {
    next(error);
  }
};

// GET /properties/:id
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const isOwner = property.ownerId.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';
    if (property.status !== 'approved' && !isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Property not available' });
    }

    res.status(200).json({ success: true, data: { property } });
  } catch (error) {
    next(error);
  }
};

// PATCH /properties/:id
export const updateProperty = async (req, res, next) => {
  try {
    const property = req.property;
    const updates = pickFields(req.body);
    const isAdmin = req.user.role === 'admin';
    const isOwner = property.ownerId.toString() === req.user.userId;

    // Owner edits reset status to pending
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
      message: 'Property updated',
      data: { property: updated },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /properties/:id
export const deleteProperty = async (req, res, next) => {
  try {
    await Property.findByIdAndDelete(req.property._id);
    res.status(200).json({ success: true, message: 'Property deleted' });
  } catch (error) {
    next(error);
  }
};

// GET /properties/owner/my-properties
export const getOwnerProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};

// GET /properties/admin/all
export const getAdminProperties = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePage(req.query);
    const filter = buildFilter(req.query, { adminView: true });
    const sort = buildSort(req.query.sort || 'newest');

    const [properties, total] = await Promise.all([
      Property.find(filter).sort(sort).skip(skip).limit(limit),
      Property.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /properties/:id/approve
export const approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    property.status = 'approved';
    property.rejectionFeedback = '';
    await property.save();

    res.status(200).json({ success: true, message: 'Property approved', data: { property } });
  } catch (error) {
    next(error);
  }
};

// PATCH /properties/:id/reject
export const rejectProperty = async (req, res, next) => {
  try {
    const { rejectionFeedback } = req.body;
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    property.status = 'rejected';
    property.rejectionFeedback = rejectionFeedback?.trim() || '';
    await property.save();

    res.status(200).json({ success: true, message: 'Property rejected', data: { property } });
  } catch (error) {
    next(error);
  }
};
