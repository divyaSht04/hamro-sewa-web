import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

export const getCustomerInfo = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer/info/${customerId}`, {
      headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }); 

    return response.data;
  } catch (error) {
    console.error("Error in getCustomerInfo:", error);
    throw new Error(error.response?.data?.message || 'Failed to fetch customer information');
  }
};

export const updateCustomerProfile = async (customerId, customerData) => {
  try {
    const formData = new FormData();
    
    Object.keys(customerData).forEach(key => {
      if (key === 'image') {
        if (customerData.image instanceof File) {
          formData.append('image', customerData.image);
        }
      } else if (customerData[key] !== null && customerData[key] !== undefined) {
        formData.append(key, customerData[key]);
      }
    });

    // Update profile data
    const response = await axios.put(
      `${API_BASE_URL}/customer/edit-customer/${customerId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in updateCustomerProfile:", error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const changePassword = async (customerId, passwordData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/customer/change-password/${customerId}`,
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in changePassword:", error);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};