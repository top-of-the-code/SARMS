import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

// Icon and color mapping per toast type
const TOAST_STYLES = {
  success: {
    icon: CheckCircle,
    bar: 'bg-emerald-500',
    icon_color: 'text-emerald-500',
    bg: 'bg-white',
  },
  error: {
    icon: XCircle,
    bar: 'bg-red-500',
    icon_color: 'text-red-500',
    bg: 'bg-white',
  },
  info: {
    icon: Info,
    bar: 'bg-blue-500',
    icon_color: 'text-blue-500',
    bg: 'bg-white',
  },
};

/**
 * Individual Toast notification card.
 */
function Toast({ toast, onRemove }) {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.success;
  const Icon = style.icon;

  return (
    <div
      className={`
        flex items-start gap-3 w-80 ${style.bg} rounded-xl shadow-modal px-4 py-3
        border border-gray-100 animate-slide-in-right relative overflow-hidden
      `}
    >
      {/* Accent bar on the left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar} rounded-l-xl`} />

      <Icon className={`shrink-0 w-5 h-5 mt-0.5 ${style.icon_color}`} />

      <p className="text-sm text-gray-700 font-medium flex-1 leading-snug">
        {toast.message}
      </p>

      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-smooth"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * ToastContainer, renders all active toasts in the bottom-right corner.
 * Place this once at the top level of your app layout.
 */
export function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
