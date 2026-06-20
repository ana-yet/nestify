export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
];

export const RENT_TYPES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Listings' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export const AMENITY_OPTIONS = [
  'High-Speed WiFi',
  'Parking',
  'Pet Friendly',
  'Air Conditioning',
  'In-Unit Washer',
  'Swimming Pool',
  'Gym Access',
  'Central Heating',
  'Balcony',
  'Security System',
];

export const formatRent = (rent, rentType = 'monthly') => {
  const suffix = { monthly: '/mo', weekly: '/wk', daily: '/day' }[rentType] || '/mo';
  return { amount: rent?.toLocaleString() ?? '0', suffix };
};

export const formatLocation = (location) => {
  if (!location) return '';
  return [location.city, location.state].filter(Boolean).join(', ');
};

export const getPropertyImage = (property) => {
  return property?.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
};
