import { Router } from 'express';
import { body } from 'express-validator';
import { createSession, verifyPayment } from '../controllers/payment.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import verifyRole from '../middleware/verifyRole.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.post(
  '/create-checkout-session',
  verifyJWT,
  verifyRole('tenant'),
  [body('bookingId').isMongoId().withMessage('Valid booking ID is required')],
  validateRequest,
  createSession
);

router.get(
  '/verify/:sessionId',
  verifyJWT,
  verifyRole('tenant'),
  verifyPayment
);

export default router;
