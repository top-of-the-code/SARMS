import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Modal dialog with overlay.
 * Props:
 *   isOpen     — boolean
 *   onClose    — function
 *   title      — string
 *   children   — modal body content
 *   footer     — optional footer JSX (action buttons)
 *   size       — 'sm' | 'md' | 'lg' | 'xl' (default 'md')
 */
export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-modal animate-slide-up`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-navy">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-100 transition-smooth"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
