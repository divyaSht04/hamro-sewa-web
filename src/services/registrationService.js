import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

export const registerCustomer = async (userData) => {
  try {
    const formData = new FormData();

    // Add user data to formData
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('dateOfBirth', userData.dateOfBirth);
    formData.append('phoneNumber', userData.phoneNumber);
    formData.append('address', userData.address || '');
    formData.append('fullName', userData.fullName); // Use actual fullName
    
    // Add photo if it exists
    if (userData.photo) {
      formData.append('image', userData.photo);
    }

    const response = await axios.post(`${API_BASE_URL}/auth/register-customer`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || 'Registration failed');
    }
    throw new Error('Network error occurred');
  }
};

export const registerServiceProvider = async (userData) => {
  try {
    const formData = new FormData();
    
    // Add user data to formData
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('phoneNumber', userData.phoneNumber);
    formData.append('address', userData.address || '');
    formData.append('businessName', userData.businessName || userData.fullName); // Use fullName as fallback
    formData.append('serviceCategory', userData.serviceCategory);
    formData.append('description', userData.description || '');
    formData.append('hourlyRate', userData.hourlyRate || 0);
    
    // Add photo if it exists
    if (userData.photo) {
      formData.append('image', userData.photo);
    }

    const response = await axios.post(`${API_BASE_URL}/auth/register-service-provider`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || 'Registration failed');
    }
    throw new Error('Network error occurred');
  }
};