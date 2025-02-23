import axios from 'axios';

const API_URL = 'http://localhost:8084/auth';

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
                const token = response.data;
                // Parse the JWT to get user info
                const userData = JSON.parse(atob(token.split('.')[1]));
                
                // Store both token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Set the default Authorization header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                return { token, user: userData };
            }
            throw new Error('Invalid response from server');
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data || 'Invalid email or password';
                throw new Error(errorMessage);
            } else if (error.request) {
                throw new Error('Unable to connect to the server. Please check your internet connection.');
            } else {
                throw error;
            }
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
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear all auth-related data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Remove any cached data
            sessionStorage.clear();
            // Reset axios default headers
            delete axios.defaults.headers.common['Authorization'];
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
            if (error.response) {
                throw new Error(error.response.data || 'Registration failed');
            } else if (error.request) {
                throw new Error('Unable to connect to the server. Please check your internet connection.');
            } else {
                throw error;
            }
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
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000; // Convert to milliseconds
            
            // Check if token is expired or will expire in the next 5 minutes
            const expiresIn = expiry - Date.now();
            if (expiresIn <= 0) {
                authService.logout(); // Auto logout if token is expired
                return false;
            }
            
            // If token will expire in less than 5 minutes, we could implement token refresh here
            if (expiresIn < 300000) { // 5 minutes in milliseconds
                console.warn('Token will expire soon');
                // TODO: Implement token refresh logic here
            }
            
            return true;
        } catch (e) {
            console.error('Error parsing token:', e);
            return false;
        }
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

// Add response interceptor to handle unauthorized responses
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Clear auth data on unauthorized response
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            
            // Redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
