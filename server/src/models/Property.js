import mongoose from 'mongoose';

const PROPERTY_TYPES = ['apartment', 'house', 'condo', 'villa', 'townhouse'];
const RENT_TYPES = ['monthly', 'weekly', 'daily'];
const STATUSES = ['pending', 'approved', 'rejected'];

const locationSchema = new mongoose.Schema(
  {
    address: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, default: '' },
    zip: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: 'USA' },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
  },
  { _id: false }
);

const ownerInfoSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    photo: { type: String, default: '' },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    locationSearch: {
      type: String,
      trim: true,
    },
    propertyType: {
      type: String,
      enum: PROPERTY_TYPES,
      required: [true, 'Property type is required'],
    },
    rent: {
      type: Number,
      required: [true, 'Rent is required'],
      min: [0, 'Rent must be positive'],
    },
    rentType: {
      type: String,
      enum: RENT_TYPES,
      default: 'monthly',
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    propertySize: {
      type: Number,
      default: 0,
      min: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    extraFeatures: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'pending',
    },
    rejectionFeedback: {
      type: String,
      default: '',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerInfo: {
      type: ownerInfoSchema,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ status: 1, createdAt: -1 });
propertySchema.index({ ownerId: 1, status: 1 });
propertySchema.index({ rent: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ locationSearch: 'text' });
propertySchema.index({ 'location.city': 1 });

propertySchema.pre('save', function buildLocationSearch(next) {
  const { address, city, state, zip, country } = this.location || {};
  this.locationSearch = [address, city, state, zip, country]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  next();
});

propertySchema.pre('findOneAndUpdate', function buildLocationSearchOnUpdate(next) {
  const update = this.getUpdate();
  const location = update?.location || update?.$set?.location;
  if (location) {
    const { address, city, state, zip, country } = location;
    const locationSearch = [address, city, state, zip, country]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (update.$set) {
      update.$set.locationSearch = locationSearch;
    } else {
      update.locationSearch = locationSearch;
    }
  }
  next();
});

const Property = mongoose.model('Property', propertySchema);

export { PROPERTY_TYPES, RENT_TYPES, STATUSES };
export default Property;
