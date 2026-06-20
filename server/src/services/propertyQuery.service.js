const SORT_MAP = {
  price_asc: { rent: 1 },
  price_desc: { rent: -1 },
  newest: { createdAt: -1 },
  rating: { averageRating: -1, reviewCount: -1 },
};

export const buildPropertyFilter = (query = {}, options = {}) => {
  const { forceApproved = false, ownerId = null, adminView = false } = options;
  const filter = {};

  if (forceApproved) {
    filter.status = 'approved';
  } else if (!adminView && !ownerId) {
    filter.status = 'approved';
  }

  if (ownerId) {
    filter.ownerId = ownerId;
  }

  if (query.status && adminView) {
    filter.status = query.status;
  }

  const { location, propertyType, minPrice, maxPrice, bedrooms, bathrooms } = query;

  if (location) {
    const regex = new RegExp(location.trim(), 'i');
    filter.$or = [
      { locationSearch: regex },
      { 'location.city': regex },
      { 'location.state': regex },
      { 'location.address': regex },
    ];
  }

  if (propertyType) {
    const types = propertyType
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (types.length === 1) {
      filter.propertyType = types[0];
    } else if (types.length > 1) {
      filter.propertyType = { $in: types };
    }
  }

  if (minPrice || maxPrice) {
    filter.rent = {};
    if (minPrice) filter.rent.$gte = Number(minPrice);
    if (maxPrice) filter.rent.$lte = Number(maxPrice);
  }

  if (bedrooms) {
    filter.bedrooms = { $gte: Number(bedrooms) };
  }

  if (bathrooms) {
    filter.bathrooms = { $gte: Number(bathrooms) };
  }

  return filter;
};

export const buildSortOption = (sortKey) => {
  return SORT_MAP[sortKey] || SORT_MAP.newest;
};

export const parsePagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 12));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const formatPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
});

export default {
  buildPropertyFilter,
  buildSortOption,
  parsePagination,
  formatPagination,
};
