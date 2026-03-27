import { createContext, useContext, useState } from 'react';
import { validateCredentials } from '../data/users';

// ── Auth Context ──────────────────────────────────────────────
// Provides currentUser (null when logged out) and login/logout helpers.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * Attempt login. Returns true on success, false on failure.
   * @param {string} id    - student roll no / faculty ID / admin ID
   * @param {string} password
   */
  function login(id, password) {
    const user = validateCredentials(id.trim(), password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }

  function logout() {
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access AuthContext.
 * Must be used inside an AuthProvider.
 */
export function useAuth() {
  return useContext(AuthContext);
}
