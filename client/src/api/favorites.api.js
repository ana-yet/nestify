import axiosInstance from "./axiosInstance.js";

export const fetchFavorites = async () => {
  const { data } = await axiosInstance.get("/favorites");
  return data.data;
};

export const addFavorite = async (propertyId) => {
  const { data } = await axiosInstance.post("/favorites", { propertyId });
  return data.data;
};

export const removeFavorite = async (propertyId) => {
  await axiosInstance.delete(`/favorites/${propertyId}`);
};

export const checkFavorite = async (propertyId) => {
  try {
    const { data } = await axiosInstance.get(`/favorites/check/${propertyId}`);
    return Boolean(data?.data?.isFavorite ?? data?.data?.isFavorited);
  } catch {
    return false;
  }
};
