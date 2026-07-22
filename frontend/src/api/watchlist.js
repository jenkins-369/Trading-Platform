import api from './api';

export const createWatchlist = async (name) => {
  const response = await api.post('/watchlist', { name });
  return response.data;
};

export const getWatchlists = async () => {
  const response = await api.get('/watchlist');
  return response.data;
};

export const addWatchlistItem = async (watchlistId, symbol, companyName) => {
  const response = await api.post(`/watchlist/${watchlistId}/items`, null, {
    params: { symbol, companyName },
  });
  return response.data;
};

export const removeWatchlistItem = async (watchlistId, symbol) => {
  const response = await api.delete(`/watchlist/${watchlistId}/items/${symbol}`);
  return response.data;
};

export const deleteWatchlist = async (watchlistId) => {
  const response = await api.delete(`/watchlist/${watchlistId}`);
  return response.data;
};

export const getAllWatchlists = async () => {
  const response = await api.get('/watchlist/admin/watchlists');
  return response.data;
};

export const getWatchlistsByUser = async (userId) => {
  const response = await api.get(`/watchlist/admin/watchlists/user/${userId}`);
  return response.data;
};
