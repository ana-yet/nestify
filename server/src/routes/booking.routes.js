import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createBooking,
  getMyBookings,
  getOwnerBookingRequests,
  getBookingById,
  approveBooking,
  rejectBooking,
} from '../controllers/booking.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import verifyRole from '../middleware/verifyRole.js';
import verifyBookingOwner from '../middleware/verifyBookingOwner.js';
import validateRequest from '../middleware/validateRequest.js';

const router = Router();

router.post(
  '/',
  verifyJWT,
  verifyRole('tenant'),
  [
    body('propertyId').isMongoId().withMessage('Valid property ID is required'),
    body('moveInDate').isISO8601().withMessage('Valid move-in date is required'),
    body('contactNumber').trim().notEmpty().withMessage('Contact number is required'),
    body('tenantInfo.name').optional().trim(),
    body('tenantInfo.email').optional().isEmail(),
    body('additionalNotes').optional().trim(),
  ],
  validateRequest,
  createBooking
);

router.get('/my-bookings', verifyJWT, verifyRole('tenant'), getMyBookings);

router.get(
  '/owner/requests',
  verifyJWT,
  verifyRole('owner'),
  getOwnerBookingRequests
);

router.patch(
  '/:id/approve',
  verifyJWT,
  verifyRole('owner'),
  [param('id').isMongoId().withMessage('Invalid booking ID')],
  validateRequest,
  verifyBookingOwner,
  approveBooking
);

router.patch(
  '/:id/reject',
  verifyJWT,
  verifyRole('owner'),
  [
    param('id').isMongoId().withMessage('Invalid booking ID'),
    body('rejectedReason').optional().trim(),
  ],
  validateRequest,
  verifyBookingOwner,
  rejectBooking
);

router.get(
  '/:id',
  verifyJWT,
  [param('id').isMongoId().withMessage('Invalid booking ID')],
  validateRequest,
  getBookingById
);

export default router;
