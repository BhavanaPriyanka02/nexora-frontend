import api from "./axios";

export const addToCart = (productId) =>
  api.post("/cart/add", { product_id: productId });

export const getCart = () => api.get("/cart");

export const removeFromCart = (productId) =>
  api.post("/cart/remove", { product_id: productId });
