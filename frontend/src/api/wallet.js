import api from './api';

export const getWalletBalance = async (userId) => {
  const params = userId ? { params: { userId } } : {};
  const response = await api.get('/wallet/balance', params);
  return response.data;
};

export const deposit = async (amount, currency, userId) => {
  const params = userId ? { params: { userId } } : {};
  const response = await api.post('/wallet/deposit', { amount, currency }, params);
  return response.data;
};

export const withdraw = async (amount, currency, userId) => {
  const params = userId ? { params: { userId } } : {};
  const response = await api.post('/wallet/withdraw', { amount, currency }, params);
  return response.data;
};
