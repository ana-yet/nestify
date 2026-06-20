import axiosInstance from './axiosInstance.js';

export const fetchAdminUsers = async (params = {}) => {
  const { data } = await axiosInstance.get('/admin/users', { params });
  return { users: data.data, pagination: data.pagination };
};

export const fetchAdminBookings = async (params = {}) => {
  const { data } = await axiosInstance.get('/admin/bookings', { params });
  return { bookings: data.data, pagination: data.pagination };
};

export const fetchAdminTransactions = async (params = {}) => {
  const { data } = await axiosInstance.get('/admin/transactions', { params });
  return { transactions: data.data, pagination: data.pagination };
};

export const updateUserRole = async (userId, role) => {
  const { data } = await axiosInstance.patch(`/users/${userId}/role`, { role });
  return data.data.user;
};
