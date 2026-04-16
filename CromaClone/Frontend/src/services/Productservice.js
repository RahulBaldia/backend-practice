import API from "./Api";

// Sab products
export const getProducts = async (category = "") => {
  const { data } = await API.get(`/products${category ? `?category=${category}` : ""}`);
  return data;
};

// Single product
export const getProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

// Review add karo
export const addReview = async (productId, reviewData) => {
  const { data } = await API.post(`/products/${productId}/reviews`, reviewData);
  return data;
};