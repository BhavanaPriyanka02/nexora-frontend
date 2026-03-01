import api from "./axios";

export const createOrder = (items) => {
  return api.post("/orders/create", { items });
};

export const getOrders = () => {
  return api.get("/orders");
};

export const updateOrderStatus = (orderId, status) => {
  return api.put(`/orders/${orderId}/status`, { status });
};
