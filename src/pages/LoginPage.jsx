import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateCredentials } from '../data/users';
import { GraduationCap, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

// Redirect to home page per role
const ROLE_HOME = {
  student: '/student/timetable',
  faculty: '/faculty/courses',
  admin:   '/admin/courses',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [id, setId]                 = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(id, password);
      if (success) {
        // Determine role to redirect
        const user = validateCredentials(id.trim(), password);
        navigate(ROLE_HOME[user.role], { replace: true });
      } else {
        setError('Invalid ID or password');
        setLoading(false);
      }
    }, 500);
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-sans">
      
      {/* ── Left Panel: University Branding ── */}
      <div className="hidden lg:flex flex-col flex-1 bg-navy text-white justify-center items-center p-12 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute w-96 h-96 bg-gold rounded-full blur-[100px] -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-[120px] bottom-10 right-10"></div>
        </div>
        
        <div className="z-10 text-center max-w-lg">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 shadow-lg backdrop-blur-md border border-white/20 mb-8">
            <GraduationCap className="w-14 h-14 text-gold" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-white">CompScience University</h1>
          <p className="text-lg text-white/70 font-medium">Integrated Campus Management Portal</p>
          <div className="mt-12 space-y-4 text-sm text-white/50">
            <p className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span> Academic Excellence since 1995
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span> Empowering Future Leaders
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white lg:bg-[#F5F5F5]">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-gray-100 p-10 lg:p-12">
          
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy shadow-modal mb-4">
              <GraduationCap className="w-9 h-9 text-gold" />
            </div>
            <h1 className="text-3xl font-extrabold text-navy tracking-tight">CompScience</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-navy mb-2">Sign In</h2>
            <p className="text-sm text-gray-500 font-medium">Please enter your credentials to access the portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* University ID */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                University ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text" 
                value={id} 
                onChange={e => setId(e.target.value)} 
                required
                placeholder="Enter your ID"
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gold/20 focus:border-gold transition-all duration-200 bg-gray-50 placeholder-gray-400 font-medium text-navy"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} 
                  value={password}
                  onChange={e => setPassword(e.target.value)} 
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gold/20 focus:border-gold transition-all duration-200 bg-gray-50 placeholder-gray-400 font-medium text-navy"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors duration-200 p-1 rounded-md hover:bg-gray-200/50"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50/80 border border-red-200 rounded-xl animate-fade-in text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy-light focus:ring-4 focus:ring-navy/20 transition-all duration-200 shadow-[0_4px_14px_0_rgba(10,31,68,0.39)] hover:shadow-[0_6px_20px_rgba(10,31,68,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_14px_0_rgba(10,31,68,0.39)] mt-6"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <LogIn className="w-4 h-4" />
              }
              {loading ? 'Authenticating…' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[11px] text-gray-400 font-medium">
              © {new Date().getFullYear()} CompScience University. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
