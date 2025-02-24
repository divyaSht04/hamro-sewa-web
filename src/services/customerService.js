import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

export const getCustomerInfo = async (customerId) => {
  try {
    console.log('Fetching customer info for ID:', customerId); // Debug log
    const response = await axios.get(`${API_BASE_URL}/customer/info/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token for authentication
      }
    });
    console.log('Customer info response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error in getCustomerInfo:', error.response || error); // Debug log
    if (error.response?.status === 401) {
      throw new Error('Please login again to continue');
    }
    if (error.response) {
      throw new Error(error.response.data || 'Failed to fetch customer information');
    }
    throw new Error('Network error occurred');
  }
};

export const updateCustomerProfile = async (customerId, customerData) => {
  try {
    console.log('Updating customer profile:', { customerId, customerData }); // Debug log

    // If there's a new image, handle it separately
    if (customerData.photo) {
      const formData = new FormData();
      formData.append('image', customerData.photo);
      // Handle image upload if needed
      console.log('Handling image upload'); // Debug log
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
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token for authentication
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Update response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error in updateCustomerProfile:', error.response || error); // Debug log
    if (error.response?.status === 401) {
      throw new Error('Please login again to continue');
    }
    if (error.response) {
      throw new Error(error.response.data || 'Failed to update profile');
    }
    throw new Error('Network error occurred');
  }
};
