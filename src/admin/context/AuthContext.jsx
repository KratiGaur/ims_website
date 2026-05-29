import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginService, logout as logoutService, checkSession } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkSession()
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          setCsrfToken(data.csrf_token || null);
        } else {
          setUser(null);
          setCsrfToken(null);
        }
      })
      .catch(() => {
        setUser(null);
        setCsrfToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Expose CSRF token to centralized fetch wrappers without duplicating logic.
    window.__ADMIN_CSRF_TOKEN__ = csrfToken;
  }, [csrfToken]);


  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(email, password);
      if (response.success) {
        setUser(response.user);
        setCsrfToken(response.csrf_token || null);
      } else {
        setError(response.message || 'Unable to sign in.');
      }
      return response;
    } catch (err) {
      const message = err?.message || 'Unexpected login error.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, csrfToken, loading, error, login, logout, setError }),
    [user, csrfToken, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
