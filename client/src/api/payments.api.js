import axiosInstance from './axiosInstance.js';

export const createCheckoutSession = async (bookingId) => {
  const { data } = await axiosInstance.post('/payments/create-checkout-session', { bookingId });
  return data.data;
};

export const verifyPayment = async (sessionId) => {
  const { data } = await axiosInstance.get(`/payments/verify/${sessionId}`);
  return data.data;
};
