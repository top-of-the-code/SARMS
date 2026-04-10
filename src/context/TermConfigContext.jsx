import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const TermConfigContext = createContext(null);

/**
 * Shared active term (currentSemester from API) so admin term changes propagate without a full reload.
 */
export function TermConfigProvider({ children }) {
  const [termConfig, setTermConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshTerm = useCallback(async () => {
    try {
      const res = await api.get('/config/currentSemester');
      const v = res.data?.value;
      if (v && typeof v === 'object') {
        setTermConfig(v);
        return v;
      }
    } catch {
      // keep previous termConfig on failure
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  useEffect(() => {
    refreshTerm();
  }, [refreshTerm]);

  const mergeTermFromServer = useCallback((obj) => {
    if (obj && typeof obj === 'object') {
      setTermConfig((prev) => ({ ...(prev || {}), ...obj }));
    }
  }, []);

  return (
    <TermConfigContext.Provider value={{ termConfig, loading, refreshTerm, mergeTermFromServer }}>
      {children}
    </TermConfigContext.Provider>
  );
}

export function useTermConfig() {
  const ctx = useContext(TermConfigContext);
  if (!ctx) {
    throw new Error('useTermConfig must be used within TermConfigProvider');
  }
  return ctx;
}
