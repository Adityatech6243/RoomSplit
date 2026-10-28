import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

// ── helpers ──────────────────────────────────────────────────────────────────
const STORAGE_TOKEN = 'roomsplit_token';
const STORAGE_USER  = 'roomsplit_user';

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const persistUser = (user) => {
  if (user) localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  else       localStorage.removeItem(STORAGE_USER);
};

// ── provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem(STORAGE_TOKEN) || null;
  const storedUser  = readStoredUser();

  // Initialise synchronously from localStorage — no waiting for an API call
  const [currentUser, setCurrentUser] = useState(storedUser);
  const [token,       setToken]       = useState(storedToken);
  // loading is false immediately when we already have a cached user+token
  const [loading,     setLoading]     = useState(!(storedToken && storedUser));

  useEffect(() => {
    const storedTok = localStorage.getItem(STORAGE_TOKEN);
    if (!storedTok) {
      // No token at all → nothing to validate
      setLoading(false);
      return;
    }

    if (storedUser) {
      // We already showed the UI with cached user; silently validate in background.
      // If the token is expired the interceptor in api.js will catch the 401
      // and redirect to /login automatically.
      userService.getCurrentUser()
        .then(user => { setCurrentUser(user); persistUser(user); })
        .catch(() => {
          // Token expired / revoked — clear everything and let the 401
          // interceptor redirect to /login
          localStorage.removeItem(STORAGE_TOKEN);
          localStorage.removeItem(STORAGE_USER);
          setToken(null);
          setCurrentUser(null);
        });
      // Don't block rendering — loading stays false
      return;
    }

    // Token exists but no cached user (edge case) — must fetch before rendering
    userService.getCurrentUser()
      .then(user => { setCurrentUser(user); persistUser(user); })
      .catch(() => {
        localStorage.removeItem(STORAGE_TOKEN);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    const receivedToken = res.token || 'mock-token-' + Date.now();
    localStorage.setItem(STORAGE_TOKEN, receivedToken);
    setToken(receivedToken);
    setCurrentUser(res.user);
    persistUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authService.register(userData);
    const receivedToken = res.token || 'mock-token-' + Date.now();
    localStorage.setItem(STORAGE_TOKEN, receivedToken);
    setToken(receivedToken);
    setCurrentUser(res.user);
    persistUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setToken(null);
    setCurrentUser(null);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setCurrentUser(prev => {
      const merged = { ...prev, ...updatedUserData };
      persistUser(merged);
      return merged;
    });
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
