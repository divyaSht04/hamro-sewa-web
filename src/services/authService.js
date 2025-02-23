import axios from 'axios';

const API_URL = 'http://localhost:8084/auth';

export const authService = {
    login: async (email, password) => {
        try {
            const loginData = {
                email: email,
                password: password
            };
            console.log('Sending login request:', loginData);
            const response = await axios.post(`${API_URL}/login`, loginData);
            console.log('Login response:', response);
            if (response.data) {
                localStorage.setItem('token', response.data);
                return response.data;
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error.response?.data || 'An error occurred during login';
        }
    },

    registerCustomer: async (formData) => {
        try {
            const response = await axios.post(`${API_URL}/register-customer`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw error.response?.data || 'An error occurred during registration';
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

// Add axios interceptor to include token in all requests
axios.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
