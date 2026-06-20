import catchAsync from '../utils/catchAsync.js';
import {
  getOwnerSummary,
  getOwnerMonthlyEarnings,
} from '../services/analytics.service.js';

export const ownerSummary = catchAsync(async (req, res) => {
  const summary = await getOwnerSummary(req.user.userId);

  res.status(200).json({
    success: true,
    data: summary,
  });
});

export const ownerMonthlyEarnings = catchAsync(async (req, res) => {
  const earnings = await getOwnerMonthlyEarnings(req.user.userId);

  res.status(200).json({
    success: true,
    data: earnings,
  });
});
