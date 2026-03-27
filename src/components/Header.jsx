import { useAuth } from '../context/AuthContext';
import { Bell, GraduationCap } from 'lucide-react';

// Role badge color mapping
const ROLE_BADGE = {
  student: { label: 'Student', cls: 'bg-blue-100 text-blue-700' },
  faculty: { label: 'Faculty', cls: 'bg-emerald-100 text-emerald-700' },
  admin:   { label: 'Admin',   cls: 'bg-purple-100 text-purple-700' },
};

/**
 * Top header bar, shows user name, role badge, and avatar with initials.
 */
export default function Header() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const badge = ROLE_BADGE[currentUser.role];

  // Generate initials from user's name
  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm shrink-0">
      {/* Left: University info */}
      <div>
        <h1 className="text-base font-bold text-navy leading-none">
          MRCA University
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Integrated Campus Portal</p>
      </div>

      {/* Right: user info + avatar */}
      <div className="flex items-center gap-4">
        {/* Notification bell (decorative) */}
        <button className="relative p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-navy transition-smooth">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold rounded-full" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-navy leading-none">{currentUser.name}</p>
            <div className="flex items-center justify-end gap-1.5 mt-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                {badge.label}
              </span>
              <span className="text-[10px] text-gray-400">{currentUser.id}</span>
            </div>
          </div>

          {/* Avatar circle with initials */}
          <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0 ring-2 ring-gold/30">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
