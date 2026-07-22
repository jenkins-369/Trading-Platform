import api from './api';

export const getPortfolio = async () => {
  const response = await api.get('/portfolio');
  return response.data;
};

export const getPortfolioSummary = async () => {
  const response = await api.get('/portfolio/summary');
  return response.data;
};

export const getAllPortfolios = async () => {
  const response = await api.get('/portfolio/admin/portfolios');
  return response.data;
};

export const getPortfolioByUser = async (userId) => {
  const response = await api.get(`/portfolio/admin/portfolios/user/${userId}`);
  return response.data;
};

export const getPortfolioSummaryByUser = async (userId) => {
  const response = await api.get(`/portfolio/admin/portfolios/summary/user/${userId}`);
  return response.data;
};
