import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";
import Property from "../models/Property.js";

const parsePage = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  return { page, limit, skip: (page - 1) * limit };
};

// GET /admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePage(req.query);
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: users.map((u) => u.toPublicJSON()),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["tenant", "owner", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Prevent self-demotion
    if (user._id.toString() === req.user.userId && role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot change your own admin role" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Role updated",
      data: { user: user.toPublicJSON() },
    });
  } catch (error) {
    next(error);
  }
};

// GET /admin/bookings
export const getAllBookings = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePage(req.query);
    const [bookings, total] = await Promise.all([
      Booking.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("propertyId", "title location")
        .populate("tenantId", "name email")
        .populate("ownerId", "name email"),
      Booking.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /admin/transactions
export const getAllTransactions = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePage(req.query);
    const filter = {};

    // Search by property name, tenant name, owner name, or transaction ID
    if (req.query.search) {
      const search = req.query.search.trim();
      // Try to find matching users
      const matchingUsers = await User.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");
      const userIds = matchingUsers.map((u) => u._id);

      // Try to find matching properties
      const matchingProps = await Property.find({
        title: { $regex: search, $options: "i" },
      }).select("_id");
      const propIds = matchingProps.map((p) => p._id);

      filter.$or = [
        { propertyId: { $in: propIds } },
        { tenantId: { $in: userIds } },
        { ownerId: { $in: userIds } },
        { stripePaymentIntentId: { $regex: search, $options: "i" } },
        { stripeSessionId: { $regex: search, $options: "i" } },
      ];
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("propertyId", "title")
        .populate("tenantId", "name email")
        .populate("ownerId", "name email"),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};
