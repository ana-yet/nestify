import Property from "../models/Property.js";

const verifyPropertyOwnerOrAdmin = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const isOwner = property.ownerId.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    req.property = property;
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyPropertyOwnerOrAdmin;
