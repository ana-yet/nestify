import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createProperty,
  getProperties,
  getFeaturedProperties,
  getRecentProperties,
  getTopLocations,
  getRentalStats,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getOwnerProperties,
  getAdminProperties,
  approveProperty,
  rejectProperty,
} from '../controllers/property.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import verifyRole from '../middleware/verifyRole.js';
import verifyPropertyOwnerOrAdmin from '../middleware/verifyPropertyOwner.js';
import validateRequest from '../middleware/validateRequest.js';
import { PROPERTY_TYPES, RENT_TYPES } from '../models/Property.js';

const router = Router();

const propertyBodyValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.address').optional().trim(),
  body('location.state').optional().trim(),
  body('location.zip').optional().trim(),
  body('location.country').optional().trim(),
  body('propertyType').isIn(PROPERTY_TYPES).withMessage('Invalid property type'),
  body('rent').isFloat({ min: 0 }).withMessage('Rent must be a positive number'),
  body('rentType').optional().isIn(RENT_TYPES).withMessage('Invalid rent type'),
  body('bedrooms').optional().isInt({ min: 0 }),
  body('bathrooms').optional().isFloat({ min: 0 }),
  body('propertySize').optional().isFloat({ min: 0 }),
  body('amenities').optional().isArray(),
  body('extraFeatures').optional().isArray(),
  body('images').optional().isArray(),
];

const listQueryValidators = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'newest', 'rating']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('bedrooms').optional().isInt({ min: 0 }),
  query('bathrooms').optional().isFloat({ min: 0 }),
];

router.get('/featured', getFeaturedProperties);
router.get('/recent', getRecentProperties);
router.get('/locations/top', getTopLocations);
router.get('/stats', getRentalStats);

router.get(
  '/owner/my-properties',
  verifyJWT,
  verifyRole('owner'),
  getOwnerProperties
);

router.get(
  '/admin/all',
  verifyJWT,
  verifyRole('admin'),
  listQueryValidators,
  validateRequest,
  getAdminProperties
);

router.get('/', listQueryValidators, validateRequest, getProperties);

router.post(
  '/',
  verifyJWT,
  verifyRole('owner'),
  propertyBodyValidators,
  validateRequest,
  createProperty
);

router.patch(
  '/:id/approve',
  verifyJWT,
  verifyRole('admin'),
  param('id').isMongoId().withMessage('Invalid property ID'),
  validateRequest,
  approveProperty
);

router.patch(
  '/:id/reject',
  verifyJWT,
  verifyRole('admin'),
  param('id').isMongoId().withMessage('Invalid property ID'),
  body('rejectionFeedback')
    .trim()
    .notEmpty()
    .withMessage('Rejection feedback is required')
    .isLength({ min: 10 })
    .withMessage('Feedback must be at least 10 characters'),
  validateRequest,
  rejectProperty
);

router.get(
  '/:id',
  verifyJWT,
  param('id').isMongoId().withMessage('Invalid property ID'),
  validateRequest,
  getPropertyById
);

router.patch(
  '/:id',
  verifyJWT,
  verifyPropertyOwnerOrAdmin,
  propertyBodyValidators,
  validateRequest,
  updateProperty
);

router.delete(
  '/:id',
  verifyJWT,
  verifyPropertyOwnerOrAdmin,
  param('id').isMongoId().withMessage('Invalid property ID'),
  validateRequest,
  deleteProperty
);

export default router;
