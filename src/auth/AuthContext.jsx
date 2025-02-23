import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { ROLES, ROLE_PATHS } from '../constants/roles';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(user?.role || null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = (error) => {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
        switch (error.response.status) {
            case 400:
                message = error.response.data.message || 'Invalid request';
                break;
            case 401:
                message = 'Unauthorized access';
                setUser(null);
                setUserRole(null);
                navigate('/login');
                break;
            case 403:
                message = 'Access forbidden';
                navigate('/access-denied');
                break;
            case 404:
                message = 'Resource not found';
                break;
            case 500:
                message = 'Server error. Please try again later';
                break;
            default:
                message = error.response.data?.message || message;
        }
    } else if (error.request) {
        message = 'Network error. Please check your connection';
    }
    
    toast.error(message);
    setError(message);
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading('Logging in...');
    
    try {
      const response = await authService.login(email, password);
      toast.dismiss(loadingToast);
      
      if (response.user) {
        setUser(response.user);
        setUserRole(response.user.role);
        
        // Redirect based on role
        const rolePath = ROLE_PATHS[response.user.role] || '/';
        const from = location.state?.from?.pathname || rolePath;
        
        toast.success('Login successful! Welcome back!');
        // Small delay to ensure toast is visible
        await new Promise(resolve => setTimeout(resolve, 500));
        
        navigate(from, { replace: true });
        return { success: true };
      }
      
      throw new Error('Invalid response from server');
    } catch (err) {
      toast.dismiss(loadingToast);
      handleError(err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [navigate, location]);

  const logout = useCallback(async () => {
    try {
      const loadingToast = toast.loading('Logging out...');
      await authService.logout();
      toast.dismiss(loadingToast);
      
      setUser(null);
      setUserRole(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      handleError(err);
    }
  }, [navigate]);

  const value = {
    user,
    userRole,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
