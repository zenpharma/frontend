import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('pharma_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pharma_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { token: newToken, username: uname, role } = response.data;
    localStorage.setItem('pharma_token', newToken);
    localStorage.setItem('pharma_user', JSON.stringify({ username: uname, role }));
    setToken(newToken);
    setUser({ username: uname, role });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pharma_token');
    localStorage.removeItem('pharma_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
