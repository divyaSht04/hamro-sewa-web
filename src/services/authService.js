import axios from 'axios';
import { ROLES } from '../constants/roles';

const API_URL = 'http://localhost:8084/auth';

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

                // Create a user object with the role
                const userData = {
                    email: user.email,
                    role: userRoles[0] // Use the first role
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
            }
            // Clear all auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local data even if server request fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            throw error;
        }
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            // Get the user from storage instead of parsing token
            const user = authService.getUser();
            return !!user;
        } catch (e) {
            console.error('Error checking authentication:', e);
            return false;
        }
    }
};
