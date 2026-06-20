import axiosInstance from './axiosInstance.js';

export const createBooking = async (payload) => {
  const { data } = await axiosInstance.post('/bookings', payload);
  return data.data.booking;
};

export const fetchMyBookings = async () => {
  const { data } = await axiosInstance.get('/bookings/my-bookings');
  return data.data;
};

export const fetchBookingById = async (id) => {
  const { data } = await axiosInstance.get(`/bookings/${id}`);
  return data.data.booking;
};

export const fetchOwnerBookingRequests = async () => {
  const { data } = await axiosInstance.get('/bookings/owner/requests');
  return data.data;
};

export const approveBooking = async (id) => {
  const { data } = await axiosInstance.patch(`/bookings/${id}/approve`);
  return data.data.booking;
};

export const rejectBooking = async (id, rejectedReason = '') => {
  const { data } = await axiosInstance.patch(`/bookings/${id}/reject`, { rejectedReason });
  return data.data.booking;
};
