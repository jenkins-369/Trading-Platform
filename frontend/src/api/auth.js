import api from './api';

export const login = async (usernameOrEmail, password) => {
  const response = await api.post('/auth/login', { usernameOrEmail, password });
  return response.data;
};

export const register = async (username, email, password, firstName, lastName) => {
  const response = await api.post('/auth/register', { username, email, password, firstName, lastName });
  return response.data;
};
