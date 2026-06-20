import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getFirebaseAuth } from '../config/firebaseAdmin.js';
import ApiError from '../utils/ApiError.js';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, 'JWT_SECRET is not configured');
  }
  return secret;
};

export const signToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

export const verifyFirebaseIdToken = async (idToken) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new ApiError(500, 'Firebase Admin is not configured on the server');
  }

  try {
    return await auth.verifyIdToken(idToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired Firebase token');
  }
};

const resolveAuthProvider = (existingProvider, isGoogle) => {
  if (isGoogle) {
    return existingProvider === 'email' ? 'both' : 'google';
  }
  return existingProvider === 'google' ? 'both' : 'email';
};

export const registerWithFirebase = async ({ idToken, name, role, photo }) => {
  const decoded = await verifyFirebaseIdToken(idToken);

  if (!['tenant', 'owner'].includes(role)) {
    throw new ApiError(400, 'Role must be tenant or owner');
  }

  const email = decoded.email?.toLowerCase();
  if (!email) {
    throw new ApiError(400, 'Firebase account must include an email');
  }

  const existing = await User.findOne({
    $or: [{ email }, { firebaseUid: decoded.uid }],
  });

  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({
    firebaseUid: decoded.uid,
    name: name?.trim() || decoded.name || 'Nestify User',
    email,
    photo: photo?.trim() || decoded.picture || '',
    role,
    authProvider: decoded.firebase?.sign_in_provider === 'google.com' ? 'google' : 'email',
  });

  const token = signToken(user);
  return { user: user.toPublicJSON(), token };
};

export const loginWithFirebase = async ({ idToken }) => {
  const decoded = await verifyFirebaseIdToken(idToken);
  const email = decoded.email?.toLowerCase();

  let user = await User.findOne({
    $or: [{ firebaseUid: decoded.uid }, { email }],
  });

  if (!user) {
    throw new ApiError(404, 'No account found. Please register first.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated');
  }

  if (!user.firebaseUid) {
    user.firebaseUid = decoded.uid;
  }

  user.authProvider = resolveAuthProvider(
    user.authProvider,
    decoded.firebase?.sign_in_provider === 'google.com'
  );

  if (decoded.picture && !user.photo) {
    user.photo = decoded.picture;
  }

  await user.save();

  const token = signToken(user);
  return { user: user.toPublicJSON(), token };
};

export const googleLoginWithFirebase = async ({ idToken }) => {
  const decoded = await verifyFirebaseIdToken(idToken);
  const email = decoded.email?.toLowerCase();

  if (!email) {
    throw new ApiError(400, 'Google account must include an email');
  }

  let user = await User.findOne({
    $or: [{ firebaseUid: decoded.uid }, { email }],
  });

  if (!user) {
    user = await User.create({
      firebaseUid: decoded.uid,
      name: decoded.name || 'Nestify User',
      email,
      photo: decoded.picture || '',
      role: 'tenant',
      authProvider: 'google',
    });
  } else {
    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated');
    }

    user.firebaseUid = decoded.uid;
    user.authProvider = resolveAuthProvider(user.authProvider, true);

    if (decoded.picture && !user.photo) {
      user.photo = decoded.picture;
    }

    if (decoded.name && user.name === 'Nestify User') {
      user.name = decoded.name;
    }

    await user.save();
  }

  const token = signToken(user);
  return { user: user.toPublicJSON(), token };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found or inactive');
  }
  return user.toPublicJSON();
};
