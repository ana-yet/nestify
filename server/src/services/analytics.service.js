import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const buildLast12MonthKeys = () => {
  const keys = [];
  const now = new Date();

  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: MONTH_LABELS[date.getMonth()],
      key: `${date.getFullYear()}-${date.getMonth()}`,
    });
  }

  return keys;
};

export const getOwnerSummary = async (ownerId) => {
  const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

  const [earningsResult, totalProperties, totalBookings] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          ownerId: ownerObjectId,
          status: 'succeeded',
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' },
        },
      },
    ]),
    Property.countDocuments({ ownerId: ownerObjectId }),
    Booking.countDocuments({
      ownerId: ownerObjectId,
      bookingStatus: 'approved',
      paymentStatus: 'paid',
    }),
  ]);

  return {
    totalEarnings: earningsResult[0]?.totalEarnings || 0,
    totalProperties,
    totalBookings,
  };
};

export const getOwnerMonthlyEarnings = async (ownerId) => {
  const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
  const monthKeys = buildLast12MonthKeys();
  const startDate = new Date(monthKeys[0].year, monthKeys[0].month, 1);

  const aggregated = await Transaction.aggregate([
    {
      $match: {
        ownerId: ownerObjectId,
        status: 'succeeded',
        paidAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$paidAt' },
          month: { $month: '$paidAt' },
        },
        earnings: { $sum: '$amount' },
      },
    },
  ]);

  const earningsMap = aggregated.reduce((acc, row) => {
    const key = `${row._id.year}-${row._id.month - 1}`;
    acc[key] = row.earnings;
    return acc;
  }, {});

  return monthKeys.map(({ key, label }) => ({
    month: label,
    earnings: earningsMap[key] || 0,
  }));
};

export default { getOwnerSummary, getOwnerMonthlyEarnings };
