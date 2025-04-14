import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

// Step 1: Initiate customer registration and send OTP
export const initiateCustomerRegistration = async (userData) => {
  try {
    const formData = new FormData();

    // Add user data to formData
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('phoneNumber', userData.phoneNumber);
    formData.append('address', userData.address || '');
    formData.append('fullName', userData.fullName);
    formData.append('dateOfBirth', userData.dateOfBirth);
    
    // Add photo if it exists
    if (userData.photo) {
      formData.append('image', userData.photo);
    }

    const response = await axios.post(`${API_BASE_URL}/auth/initiate-customer-registration`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || error.response.data || 'Registration initiation failed');
    }
    throw new Error('Network error occurred');
  }
};

// Step 2: Verify OTP and complete customer registration
export const verifyCustomerRegistration = async (verificationData, photo) => {
  try {
    // Need to use FormData if we have a photo
    if (photo) {
      const formData = new FormData();
      formData.append('image', photo);
      
      // Add each verification property separately - this approach is more reliable
      formData.append('email', verificationData.email);
      formData.append('otp', verificationData.otp);
      
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-customer-registration`, 
        formData
        // Note: Don't set Content-Type header manually, browser will set it correctly with boundary
      );
      return response.data;
    } else {
      // If no photo, just send the verification data as JSON
      const response = await axios.post(`${API_BASE_URL}/auth/verify-customer-registration`, verificationData);
      return response.data;
    }
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || error.response.data || 'OTP verification failed');
    }
    throw new Error('Network error occurred: ' + error.message);
  }
};

// Step 1: Initiate service provider registration and send OTP
export const initiateServiceProviderRegistration = async (userData) => {
  try {
    const formData = new FormData();
    
    // Add user data to formData
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('phoneNumber', userData.phoneNumber);
    formData.append('address', userData.address || '');
    formData.append('businessName', userData.businessName);
    
    // Add photo if it exists
    if (userData.photo) {
      formData.append('image', userData.photo);
    }

    const response = await axios.post(`${API_BASE_URL}/auth/initiate-provider-registration`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || error.response.data || 'Registration initiation failed');
    }
    throw new Error('Network error occurred');
  }
};

// Step 2: Verify OTP and complete service provider registration
export const verifyServiceProviderRegistration = async (verificationData, photo) => {
  try {
    // Need to use FormData if we have a photo
    if (photo) {
      const formData = new FormData();
      formData.append('image', photo);
      
      // Add each verification property separately - this approach is more reliable
      formData.append('email', verificationData.email);
      formData.append('otp', verificationData.otp);
      
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-provider-registration`, 
        formData
        // Note: Don't set Content-Type header manually, browser will set it correctly with boundary
      );
      return response.data;
    } else {
      // If no photo, just send the verification data as JSON
      const response = await axios.post(`${API_BASE_URL}/auth/verify-provider-registration`, verificationData);
      return response.data;
    }
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || error.response.data || 'OTP verification failed');
    }
    throw new Error('Network error occurred: ' + error.message);
  }
};