import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, googleLogin, getMe } from '../controllers/auth.controller.js';
import validateRequest from '../middleware/validateRequest.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = Router();

router.post(
  '/register',
  [
    body('idToken').notEmpty().withMessage('Firebase ID token is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('role').isIn(['tenant', 'owner']).withMessage('Role must be tenant or owner'),
    body('photo').optional().isString(),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [body('idToken').notEmpty().withMessage('Firebase ID token is required')],
  validateRequest,
  login
);

router.post(
  '/google',
  [body('idToken').notEmpty().withMessage('Firebase ID token is required')],
  validateRequest,
  googleLogin
);

router.get('/me', verifyJWT, getMe);

export default router;
