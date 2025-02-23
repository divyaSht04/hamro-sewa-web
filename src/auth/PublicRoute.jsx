import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROLE_PATHS } from '../constants/roles';

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to the appropriate dashboard based on user role
    const redirectPath = ROLE_PATHS[user?.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
