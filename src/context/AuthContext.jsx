import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authClient } from '../services/authClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setCustomers([]);
    setIsAuthenticated(false);
    setIsAdmin(false);
  }, []);

  const applySession = useCallback((sessionData) => {
    const nextUser = sessionData?.user ?? null;
    const nextCustomers = Array.isArray(sessionData?.customers) ? sessionData.customers : [];

    setUser(nextUser);
    setCustomers(nextCustomers);
    setIsAuthenticated(Boolean(nextUser?.id));
    setIsAdmin(nextUser?.role === 'admin');
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);

      const response = await authClient.getMe();
      applySession(response?.data ?? null);

      return response?.data ?? null;
    } catch (error) {
      clearSession();
      return null;
    } finally {
      setLoading(false);
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async ({ email, password }) => {
    const response = await authClient.login({ email, password });
    applySession(response?.data ?? null);
    return response;
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      await authClient.logout();
    } catch {
      // ignoramos error remoto
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(() => ({
    user,
    customers,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
    refreshSession,
  }), [
    user,
    customers,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
    refreshSession,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}