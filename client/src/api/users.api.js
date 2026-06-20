import axiosInstance from './axiosInstance.js';

export const fetchProfile = async () => {
  const { data } = await axiosInstance.get('/users/profile');
  return data.data.user;
};

export const updateProfile = async (payload) => {
  const { data } = await axiosInstance.patch('/users/profile', payload);
  return data.data.user;
};
