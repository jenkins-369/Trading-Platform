import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, [user]);

  const login = async (usernameOrEmail, password) => {
    const data = await loginApi(usernameOrEmail, password);
    localStorage.setItem('token', data.token);
    const userData = {
      token: data.token,
      tokenType: data.tokenType,
      userId: data.userId,
      username: data.username,
      email: data.email,
      roles: data.roles,
    };
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password, firstName, lastName) => {
    const data = await registerApi(username, email, password, firstName, lastName);
    localStorage.setItem('token', data.token);
    const userData = {
      token: data.token,
      tokenType: data.tokenType,
      userId: data.userId,
      username: data.username,
      email: data.email,
      roles: data.roles,
    };
    setUser(userData);
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
