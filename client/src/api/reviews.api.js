import axiosInstance from './axiosInstance.js';

export const fetchFeaturedReviews = async () => {
  const { data } = await axiosInstance.get('/reviews/featured');
  return data.data;
};

export const fetchPropertyReviews = async (propertyId) => {
  const { data } = await axiosInstance.get(`/reviews/property/${propertyId}`);
  return data.data;
};

export const createReview = async (payload) => {
  const { data } = await axiosInstance.post('/reviews', payload);
  return data.data.review;
};

export const updateReview = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/reviews/${id}`, payload);
  return data.data.review;
};

export const deleteReview = async (id) => {
  await axiosInstance.delete(`/reviews/${id}`);
};
