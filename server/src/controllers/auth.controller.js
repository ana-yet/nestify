import catchAsync from '../utils/catchAsync.js';
import {
  registerWithFirebase,
  loginWithFirebase,
  googleLoginWithFirebase,
  getUserById,
} from '../services/auth.service.js';

export const register = catchAsync(async (req, res) => {
  const { idToken, name, role, photo } = req.body;
  const result = await registerWithFirebase({ idToken, name, role, photo });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result,
  });
});

export const login = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const result = await loginWithFirebase({ idToken });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const googleLogin = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const result = await googleLoginWithFirebase({ idToken });

  res.status(200).json({
    success: true,
    message: 'Google login successful',
    data: result,
  });
});

export const getMe = catchAsync(async (req, res) => {
  const user = await getUserById(req.user.userId);

  res.status(200).json({
    success: true,
    data: { user },
  });
});
