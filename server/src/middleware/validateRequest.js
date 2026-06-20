import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return next(new ApiError(400, 'Validation failed', messages));
  }
  next();
};

export default validateRequest;
