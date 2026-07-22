import api from './api';

export const placeOrder = async (orderType, symbol, quantity, price) => {
  const response = await api.post('/trading/orders', { orderType, symbol, quantity, price });
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await api.delete(`/trading/orders/${orderId}`);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/trading/orders');
  return response.data;
};

export const getOrder = async (orderId) => {
  const response = await api.get(`/trading/orders/${orderId}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/trading/admin/orders');
  return response.data;
};

export const getOrdersByUser = async (userId) => {
  const response = await api.get(`/trading/admin/orders/user/${userId}`);
  return response.data;
};

export const forceCancelOrder = async (orderId) => {
  const response = await api.delete(`/trading/admin/orders/${orderId}/force`);
  return response.data;
};
