import axiosInstance from './axiosInstance.js';

export const fetchOwnerSummary = async () => {
  const { data } = await axiosInstance.get('/analytics/owner/summary');
  return data.data;
};

export const fetchOwnerMonthlyEarnings = async () => {
  const { data } = await axiosInstance.get('/analytics/owner/monthly-earnings');
  return data.data;
};
