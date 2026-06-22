import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// GET /analytics/owner/summary
export const ownerSummary = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.userId);

    const [earningsResult, totalProperties, totalBookings] = await Promise.all([
      Transaction.aggregate([
        { $match: { ownerId, status: "succeeded" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Property.countDocuments({ ownerId }),
      Booking.countDocuments({
        ownerId,
        bookingStatus: "approved",
        paymentStatus: "paid",
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEarnings: earningsResult[0]?.total || 0,
        totalProperties,
        totalBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /analytics/owner/monthly-earnings
export const ownerMonthlyEarnings = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.userId);
    const now = new Date();

    // Build last 12 month keys
    const monthKeys = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthKeys.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: MONTHS[d.getMonth()],
      });
    }
    const startDate = new Date(monthKeys[0].year, monthKeys[0].month - 1, 1);

    const aggregated = await Transaction.aggregate([
      { $match: { ownerId, status: "succeeded", paidAt: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
          earnings: { $sum: "$amount" },
        },
      },
    ]);

    const earningsMap = {};
    for (const row of aggregated) {
      earningsMap[`${row._id.year}-${row._id.month}`] = row.earnings;
    }

    const chartData = monthKeys.map((m) => ({
      label: m.label,
      earnings: earningsMap[`${m.year}-${m.month}`] || 0,
    }));

    res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    next(error);
  }
};
