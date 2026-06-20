import { Router } from 'express';
import authRoutes from './auth.routes.js';
import propertyRoutes from './property.routes.js';
import favoriteRoutes from './favorite.routes.js';
import bookingRoutes from './booking.routes.js';
import userRoutes from './user.routes.js';
import paymentRoutes from './payment.routes.js';
import reviewRoutes from './review.routes.js';
import analyticsRoutes from './analytics.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/bookings', bookingRoutes);
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Nestify API is running' });
});

export default router;
