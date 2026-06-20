import Stripe from 'stripe';
import ApiError from '../utils/ApiError.js';

let stripeClient = null;

export const getStripe = () => {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new ApiError(500, 'STRIPE_SECRET_KEY is not configured');
  }

  stripeClient = new Stripe(secretKey);
  return stripeClient;
};

export default getStripe;
