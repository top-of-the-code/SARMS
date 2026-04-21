import { useState, useCallback } from 'react';

let nextId = 0;

/**
 * useToast, manages a list of toast notifications.
 * Usage:
 *   const { toasts, showToast, removeToast } = useToast();
 *   showToast('Saved!', 'success');       // 'success' | 'error' | 'info'
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return { toasts, showToast, removeToast };
}
