const ALLOWED_PROPERTY_FIELDS = [
  'title',
  'description',
  'location',
  'propertyType',
  'rent',
  'rentType',
  'bedrooms',
  'bathrooms',
  'propertySize',
  'amenities',
  'extraFeatures',
  'images',
];

export const pickAllowedPropertyFields = (body = {}) => {
  const picked = {};

  for (const key of ALLOWED_PROPERTY_FIELDS) {
    if (body[key] !== undefined) {
      picked[key] = body[key];
    }
  }

  return picked;
};

export default pickAllowedPropertyFields;
