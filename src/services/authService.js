import axios from 'axios';
import { ROLES } from '../constants/roles';

const API_URL = 'http://localhost:8084/auth';

// Add axios interceptors for global error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear local storage and redirect to login
            localStorage.clear();
            window.location.href = '/login';
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
                
                if (!token || !user) {
                    throw new Error('Invalid response format from server');
                }

                // Get the role from user.roles array
                const role = user.roles?.[0];
                if (!role) {
                    throw new Error('No role found in response');
                }

                // Create a user object with the role
                const userData = {
                    email: user.email,
                    role: role
                };
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                return { token, user: userData };
            }
            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                throw new Error(error.response.data || 'Authentication failed');
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
