export const propertyKeys = {
  all: ['properties'],
  list: (params) => ['properties', 'list', params],
  featured: ['properties', 'featured'],
  recent: (limit) => ['properties', 'recent', limit],
  locations: ['properties', 'locations', 'top'],
  stats: ['properties', 'stats'],
  detail: (id) => ['properties', id],
  owner: ['properties', 'owner'],
  admin: (page) => ['properties', 'admin', page],
};

export const favoriteKeys = {
  list: ['favorites', 'list'],
  check: (propertyId) => ['favorites', 'check', propertyId],
};

export const bookingKeys = {
  my: ['bookings', 'my'],
  detail: (id) => ['bookings', id],
  owner: ['bookings', 'owner'],
};

export default propertyKeys;
