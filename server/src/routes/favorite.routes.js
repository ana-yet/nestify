import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favorite.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import verifyRole from '../middleware/verifyRole.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyJWT, verifyRole('tenant'));

router.get('/', getFavorites);

router.post(
  '/',
  [body('propertyId').isMongoId().withMessage('Valid property ID is required')],
  validateRequest,
  addFavorite
);

router.get(
  '/check/:propertyId',
  [param('propertyId').isMongoId().withMessage('Invalid property ID')],
  validateRequest,
  checkFavorite
);

router.delete(
  '/:propertyId',
  [param('propertyId').isMongoId().withMessage('Invalid property ID')],
  validateRequest,
  removeFavorite
);

export default router;
