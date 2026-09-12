import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchMe, logout as apiLogout } from './api.js';

/*
 * Auth context — holds the logged-in user and syncs with the backend
 * session cookie. Usage:
 *   const { user, loading, login, logout } = useAuth();
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchMe()
      .then((data) => alive && setUser(data.user || null))
      .catch(() => alive && setUser(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback((u) => setUser(u), []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      /* backend down — clear locally anyway */
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  /* Safe fallback: if a consumer ever renders outside the provider (e.g. a
     hot-module-reload edge case), treat it as logged-out instead of crashing. */
  return (
    useContext(AuthContext) || {
      user: null,
      loading: false,
      login: () => {},
      logout: async () => {},
    }
  );
}
