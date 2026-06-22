import Stripe from 'stripe';

let stripeClient = null;

export const getStripe = () => {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};

export default getStripe;
