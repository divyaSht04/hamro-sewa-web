import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const PrivateRoute = ({ children, requiredRoles = [], LoadingComponent = DefaultLoading }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingComponent />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // For debugging
  console.log('Required roles:', requiredRoles);
  console.log('User role:', user?.role);
  console.log('User object:', user);

  // Check if the user has the required role
  const hasRequiredRole = requiredRoles.length === 0 || (user?.role && requiredRoles.includes(user.role));

  if (!hasRequiredRole) {
    console.log('Access denied - user role does not match required roles');
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

const DefaultLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);
