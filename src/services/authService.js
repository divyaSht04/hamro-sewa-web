import axios from 'axios';
const API_URL = 'http://localhost:8084/auth';

// Create a custom axios instance for authentication
const authAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to the custom instance
authAxios.interceptors.request.use(
  (config) => {
    // Skip token check for login endpoint
    if (config.url.includes('/login')) {
      return config;
    }
    const token = authService.getToken();
    if (token && authService.isTokenExpired(token)) {
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to the custom instance
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (server down, connection refused, etc.)
    if (!error.response) {
      return Promise.reject(new Error('Server is currently unavailable. Please try again later.'));
    }
    
    // Handle authentication errors
    if (error.response.status === 401) {
      // Don't automatically redirect on 401 during login
      if (!error.config.url.includes('/login')) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const loginData = {
        email: email,
        password: password
      };

      try {
        const response = await authAxios.post('/login', loginData);
        
        if (response && response.data) {
          const { token, user } = response.data;

          if (!token || !user || !user.roles) {
            throw new Error('Invalid response format from server');
          }

          const userRoles = user.roles;
          if (!userRoles.length) {
            throw new Error('No roles found in response');
          }

          // Create a user object with the role and ID
          const userData = {
            id: user.id, // Include the user ID
            email: user.email,
            role: userRoles[0], // Use the first role
            username: user.username,
            fullName: user.fullName
          };

          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          return { token, user: userData };
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (axiosError) {
        console.error('Axios error during login:', axiosError);
        
        // If it's a network error or has no response, it's likely a server unavailability issue
        if (!axiosError.response || axiosError.code === 'ERR_NETWORK') {
          throw new Error('Server is currently unavailable. Please try again later.');
        }
        
        // Handle specific HTTP status codes
        const status = axiosError.response.status;
        const errorMessage = axiosError.response.data;
        
        switch (status) {
          case 401:
            throw new Error('Incorrect password. Please try again.');
          case 404:
            throw new Error('Email not found. Please check your email address.');
          case 400:
            throw new Error(errorMessage || 'Invalid login request');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(errorMessage || 'Authentication failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await authAxios.post('/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  getTokenExpiration: function (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  },

  isTokenExpired: function (token) {
    if (!token) return true;
    const expiration = this.getTokenExpiration(token);
    return expiration ? Date.now() >= expiration : true;
  },

  // Updated isAuthenticated method
  isAuthenticated: function () {
    const token = this.getToken();
    const user = this.getUser();

    if (!token || !user) return false;

    try {
      const isExpired = this.isTokenExpired(token);
      return !!user.email && !!user.role && !isExpired;
    } catch {
      return false;
    }
  },


  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      return false;
    }

    try {
      const userData = JSON.parse(user);
      return !!userData && !!userData.email && !!userData.role;
    } catch {
      return false;
    }
  }
};