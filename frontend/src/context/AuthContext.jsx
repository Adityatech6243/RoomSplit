import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('roomsplit_token') || null);
  const [loading, setLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('roomsplit_token');
      if (storedToken) {
        try {
          const user = await userService.getCurrentUser();
          setCurrentUser(user);
        } catch (err) {
          console.warn('Session restoration failed:', err);
          localStorage.removeItem('roomsplit_token');
          setToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    const receivedToken = res.token || 'mock-token-' + Date.now();
    localStorage.setItem('roomsplit_token', receivedToken);
    setToken(receivedToken);
    setCurrentUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authService.register(userData);
    const receivedToken = res.token || 'mock-token-' + Date.now();
    localStorage.setItem('roomsplit_token', receivedToken);
    setToken(receivedToken);
    setCurrentUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('roomsplit_token');
    setToken(null);
    setCurrentUser(null);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setCurrentUser(prev => ({ ...prev, ...updatedUserData }));
  }, []);

  const value = {
    currentUser,
    token,
    isAuthenticated: !!token && !!currentUser,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
