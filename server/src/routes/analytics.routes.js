import { Router } from 'express';
import { ownerSummary, ownerMonthlyEarnings } from '../controllers/analytics.controller.js';
import verifyJWT from '../middleware/verifyJWT.js';
import verifyRole from '../middleware/verifyRole.js';

const router = Router();

router.use(verifyJWT, verifyRole('owner'));

router.get('/owner/summary', ownerSummary);
router.get('/owner/monthly-earnings', ownerMonthlyEarnings);

export default router;
