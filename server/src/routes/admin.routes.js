import { Router } from 'express';
import { query } from 'express-validator';
import {
  getAllUsers,
  getAllBookings,
  getAllTransactions,
} from '../controllers/admin.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import verifyRole from '../middleware/verifyRole.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.use(verifyJWT, verifyRole('admin'));

router.get('/users', getAllUsers);

router.get(
  '/bookings',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  validateRequest,
  getAllBookings
);

router.get(
  '/transactions',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('search').optional().isString(),
  ],
  validateRequest,
  getAllTransactions
);

export default router;
