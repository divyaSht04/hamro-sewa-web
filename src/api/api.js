import axios from 'axios';
import { authService } from '../services/authService';

const api = axios.create({
  baseURL: 'http://localhost:8084',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401,error.response.status === 403) {
      // Don't automatically redirect on 401 during login
      if (!error.config.url.includes('/login')) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;