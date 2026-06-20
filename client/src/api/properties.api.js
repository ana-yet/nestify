import axiosInstance from './axiosInstance.js';

export const fetchProperties = async (params = {}) => {
  const { data } = await axiosInstance.get('/properties', { params });
  return { properties: data.data, pagination: data.pagination };
};

export const fetchFeaturedProperties = async () => {
  const { data } = await axiosInstance.get('/properties/featured');
  return data.data;
};

export const fetchRecentProperties = async (limit = 4) => {
  const { data } = await axiosInstance.get('/properties/recent', { params: { limit } });
  return data.data;
};

export const fetchTopLocations = async () => {
  const { data } = await axiosInstance.get('/properties/locations/top');
  return data.data;
};

export const fetchRentalStats = async () => {
  const { data } = await axiosInstance.get('/properties/stats');
  return data.data;
};

export const fetchPropertyById = async (id) => {
  const { data } = await axiosInstance.get(`/properties/${id}`);
  return data.data.property;
};

export const createProperty = async (payload) => {
  const { data } = await axiosInstance.post('/properties', payload);
  return data.data.property;
};

export const updateProperty = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/properties/${id}`, payload);
  return data.data.property;
};

export const deleteProperty = async (id) => {
  await axiosInstance.delete(`/properties/${id}`);
};

export const fetchOwnerProperties = async () => {
  const { data } = await axiosInstance.get('/properties/owner/my-properties');
  return data.data;
};

export const fetchAdminProperties = async (params = {}) => {
  const { data } = await axiosInstance.get('/properties/admin/all', { params });
  return { properties: data.data, pagination: data.pagination };
};

export const approveProperty = async (id) => {
  const { data } = await axiosInstance.patch(`/properties/${id}/approve`);
  return data.data.property;
};

export const rejectProperty = async (id, rejectionFeedback) => {
  const { data } = await axiosInstance.patch(`/properties/${id}/reject`, { rejectionFeedback });
  return data.data.property;
};
