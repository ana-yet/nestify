import { Router } from 'express';
import { body, param } from 'express-validator';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { updateUserRole } from '../controllers/admin.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import verifyRole from '../middleware/verifyRole.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyJWT);

router.get('/profile', getProfile);

router.patch(
  '/profile',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('photo').optional().isString(),
    body('phone').optional().isString(),
  ],
  validateRequest,
  updateProfile
);

router.patch(
  '/:id/role',
  verifyRole('admin'),
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('role').isIn(['tenant', 'owner', 'admin']).withMessage('Invalid role'),
  ],
  validateRequest,
  updateUserRole
);

export default router;
