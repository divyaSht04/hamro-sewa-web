import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { ROLE_PATHS } from '../constants/roles';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(user?.role || null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleError = (error) => {
    let message = error.message || 'An unexpected error occurred';
    
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      message = 'Server is currently unavailable. Please try again later.';
      toast.error(message);
      setError(message);
      return;
    }
    
    if (error.response && error.response.status) {
        switch (error.response.status) {
            case 400:
                message = error.response.data || 'Invalid request';
                break;
            case 401:
                if (!location.pathname.includes('/login')) {
                    message = 'Session expired. Please login again.';
                    setUser(null);
                    setUserRole(null);
                    navigate('/login');
                } else {
                    message = error.response.data || 'Incorrect password. Please try again.';
                }
                break;
            case 403:
                message = 'Access forbidden';
                navigate('/access-denied');
                break;
            case 404:
                message = error.response.data || 'Email not found. Please check your email address.';
                break;
            case 500:
                message = 'Server error. Please try again later';
                break;
            default:
                message = error.response.data || message;
        }
    } else if (error.request) {
        message = 'Server is currently unavailable. Please try again later.';
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
      
      if (response && response.user) {
        setUser(response.user);
        setUserRole(response.user.role);
        
        const rolePath = ROLE_PATHS[response.user.role] || '/';

        console.log(rolePath);
        
        toast.success('Login successful! Welcome back!');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        navigate(rolePath, { replace: true });
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
