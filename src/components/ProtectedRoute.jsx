import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute, wraps pages that require a specific role.
 * If not logged in → redirect to /
 * If wrong role → redirect to their own dashboard home
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/" replace />;

  if (requiredRole && currentUser.role !== requiredRole) {
    const redirectMap = { student: '/student/courses', faculty: '/faculty/courses', admin: '/admin/courses' };
    return <Navigate to={redirectMap[currentUser.role] || '/'} replace />;
  }

  return children;
}
