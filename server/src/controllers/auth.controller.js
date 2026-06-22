import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getFirebaseAuth } from "../config/firebaseAdmin.js";

const signToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

const verifyFirebaseToken = async (idToken) => {
  const auth = getFirebaseAuth();
  if (!auth)
    throw Object.assign(new Error("Firebase not configured"), {
      statusCode: 500,
    });
  return auth.verifyIdToken(idToken);
};

export const register = async (req, res, next) => {
  try {
    const { idToken, name, role, photo } = req.body;
    const decoded = await verifyFirebaseToken(idToken);
    const email = decoded.email?.toLowerCase();

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    if (!["tenant", "owner"].includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Role must be tenant or owner" });
    }

    const existing = await User.findOne({
      $or: [{ email }, { firebaseUid: decoded.uid }],
    });
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Account already exists" });

    const user = await User.create({
      firebaseUid: decoded.uid,
      name: name?.trim() || decoded.name || "Nestify User",
      email,
      photo: photo?.trim() || decoded.picture || "",
      role,
      authProvider:
        decoded.firebase?.sign_in_provider === "google.com"
          ? "google"
          : "email",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { user: user.toPublicJSON(), token: signToken(user) },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const decoded = await verifyFirebaseToken(idToken);
    const email = decoded.email?.toLowerCase();

    const user = await User.findOne({
      $or: [{ firebaseUid: decoded.uid }, { email }],
    });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "No account found. Please register.",
      });
    if (!user.isActive)
      return res
        .status(403)
        .json({ success: false, message: "Account deactivated" });

    if (!user.firebaseUid) user.firebaseUid = decoded.uid;
    const isGoogle = decoded.firebase?.sign_in_provider === "google.com";
    if (isGoogle && user.authProvider === "email") user.authProvider = "both";
    else if (!isGoogle && user.authProvider === "google")
      user.authProvider = "both";
    if (decoded.picture && !user.photo) user.photo = decoded.picture;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: user.toPublicJSON(), token: signToken(user) },
    });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const decoded = await verifyFirebaseToken(idToken);
    const email = decoded.email?.toLowerCase();

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Google account must have email" });

    let user = await User.findOne({
      $or: [{ firebaseUid: decoded.uid }, { email }],
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || "Nestify User",
        email,
        photo: decoded.picture || "",
        role: "tenant",
        authProvider: "google",
      });
    } else {
      if (!user.isActive)
        return res
          .status(403)
          .json({ success: false, message: "Account deactivated" });
      user.firebaseUid = decoded.uid;
      if (user.authProvider === "email") user.authProvider = "both";
      if (decoded.picture && !user.photo) user.photo = decoded.picture;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: { user: user.toPublicJSON(), token: signToken(user) },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    res
      .status(200)
      .json({ success: true, data: { user: user.toPublicJSON() } });
  } catch (error) {
    next(error);
  }
};
