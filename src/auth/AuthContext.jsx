import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    const loadingToast = toast.loading('Logging in...');
    
    try {
      const response = await authService.login(email, password);
      toast.dismiss(loadingToast);
      
      if (response.token && response.user) {
        setUser(response.user);
        // Redirect to the page they tried to visit or home
        const from = location.state?.from?.pathname || '/';
        
        toast.success('Login successful! Welcome back!');
        // Small delay to ensure toast is visible
        await new Promise(resolve => setTimeout(resolve, 500));
        
        navigate(from, { replace: true });
        return { success: true };
      }
      
      throw new Error('Invalid response from server');
    } catch (err) {
      toast.dismiss(loadingToast);
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [navigate, location]);

  const logout = useCallback(async () => {
    try {
      const loadingToast = toast.loading('Logging out...');
      await authService.logout();
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully');
      
      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      
      // Check if token is expired or will expire in the next 5 minutes
      const expiresIn = expiry - Date.now();
      if (expiresIn <= 0) {
        logout(); // Auto logout if token is expired
        return false;
      }
      
      // If token will expire in less than 5 minutes, we could implement token refresh here
      if (expiresIn < 300000) { // 5 minutes in milliseconds
        console.warn('Token will expire soon');
      }
      
      return true;
    } catch (e) {
      console.error('Error parsing token:', e);
      return false;
    }
  }, [logout]);

  const isAdmin = useCallback(() => {
    return user?.roles?.includes('ROLE_ADMIN') || false;
  }, [user]);

  const isServiceProvider = useCallback(() => {
    return user?.roles?.includes('ROLE_SERVICE_PROVIDER') || false;
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    isServiceProvider: isServiceProvider(),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
