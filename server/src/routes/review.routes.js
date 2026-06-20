import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getFeaturedReviews,
  getPropertyReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/review.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import verifyRole from '../middleware/verifyRole.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.get('/featured', getFeaturedReviews);

router.get(
  '/property/:propertyId',
  verifyJWT,
  [param('propertyId').isMongoId().withMessage('Invalid property ID')],
  validateRequest,
  getPropertyReviews
);

router.post(
  '/',
  verifyJWT,
  verifyRole('tenant'),
  [
    body('propertyId').isMongoId().withMessage('Valid property ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  validateRequest,
  createReview
);

router.patch(
  '/:id',
  verifyJWT,
  verifyRole('tenant'),
  [
    param('id').isMongoId().withMessage('Invalid review ID'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty'),
  ],
  validateRequest,
  updateReview
);

router.delete(
  '/:id',
  verifyJWT,
  verifyRole('tenant'),
  [param('id').isMongoId().withMessage('Invalid review ID')],
  validateRequest,
  deleteReview
);

export default router;
