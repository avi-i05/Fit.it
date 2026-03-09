import api from "./axios";


export const getSellerOrders = (sellerId) => {
  return api.get(`/api/v1/orders/seller/${sellerId}`);
};


export const getOrderById = (orderId) => {
  return api.get(`/api/v1/orders/order/${orderId}`);
};


export const updateOrderStatus = (orderId, status) => {
  return api.patch(`/api/v1/orders/update-status/${orderId}`, { status });
};