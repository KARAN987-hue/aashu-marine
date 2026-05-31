/**
 * ProtectedRoute Component
 * 
 * Protects admin routes by requiring authentication.
 * Redirects unauthenticated users to login page.
 * Preserves attempted route for post-login redirect.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './common/LoadingSpinner';

/**
 * ProtectedRoute Component
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: '/admin/login')
 * @returns {React.ReactElement}
 */
export function ProtectedRoute({ children, redirectTo = '/admin/login' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Redirect to login if not authenticated, preserving the attempted route
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render protected content if authenticated
  return children;
}

export default ProtectedRoute;
