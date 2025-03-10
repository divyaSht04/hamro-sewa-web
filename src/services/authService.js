import axios from 'axios';
const API_URL = 'http://localhost:8084/auth';

axios.interceptors.request.use(
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

// Add axios interceptors for global error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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

      const response = await axios.post(`${API_URL}/login`, loginData);

      if (response.data) {
        const { token, user } = response.data;

        if (!token || !user || !user.roles) {
          throw new Error('Invalid response format from server');
        }

        // Get the role from user.roles array
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
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);

      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data;

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
      } else if (error.request) {
        throw new Error('Network error. Please check your connection');
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_URL}/logout`, {}, {
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