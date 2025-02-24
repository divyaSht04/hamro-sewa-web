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
    if (error.response?.status === 401) {
      throw new Error('Please login again to continue');
    }
    throw new Error(error.response?.data || 'Failed to fetch customer information');
  }
};

export const updateCustomerProfile = async (customerId, customerData) => {
  try {
    let imageUrl = null;

    // If there's a new photo, upload it first
    if (customerData.photo instanceof File) {
      const formData = new FormData();
      formData.append('image', customerData.photo);
      
      const imageResponse = await axios.post(
        `${API_BASE_URL}/customer/upload-photo/${customerId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      imageUrl = imageResponse.data;
    }

    // Send the profile update
    const response = await axios.put(
      `${API_BASE_URL}/customer/edit-customer/${customerId}`,
      {
        username: customerData.username,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
        address: customerData.address,
        dateOfBirth: customerData.dateOfBirth,
        fullName: customerData.fullName,
        photo: imageUrl || customerData.photo
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login again to continue');
    }
    throw new Error(error.response?.data || 'Failed to update profile');
  }
};
