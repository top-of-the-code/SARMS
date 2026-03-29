import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// ── Auth Context ──────────────────────────────────────────────
// Provides currentUser (null when logged out) and login/logout helpers.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('sarms_token');
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setCurrentUser({
            id: res.data.userId,
            role: res.data.role,
            name: res.data.name
          });
        })
        .catch(() => {
          localStorage.removeItem('sarms_token');
          setCurrentUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Attempt login via API. Returns {success, user, error}
   */
  async function login(id, password) {
    try {
      const res = await api.post('/auth/login', { userId: id.trim(), password });
      localStorage.setItem('sarms_token', res.data.token);
      
      const user = {
        id: res.data.userId,
        role: res.data.role,
        name: res.data.name
      };
      
      setCurrentUser(user);
      return { success: true, user: user };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Invalid ID or password' 
      };
    }
  }

  function logout() {
    localStorage.removeItem('sarms_token');
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
