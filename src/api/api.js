import axios from 'axios';
import { authService } from '../services/authService';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized error (e.g., clear token and redirect to login)
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

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

export default api;