import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

export const getCustomerInfo = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer/info/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Transform the response to include full image URL if image exists
    if (response.data && response.data.length > 0) {
      const customerData = response.data[0];
      if (customerData.image) {
        customerData.image = `${API_BASE_URL}/uploads/${customerData.image}`;
        console.log("Image URL:", customerData.image);
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error in getCustomerInfo:", error);
    throw new Error(error.response?.data?.message || 'Failed to fetch customer information');
  }
};

export const updateCustomerProfile = async (customerId, customerData) => {
  try {
    // Create FormData for sending both profile data and image
    const formData = new FormData();

    // Add all text fields to FormData
    Object.keys(customerData).forEach(key => {
      if (key === 'image') {
        if (customerData.image instanceof File) {
          formData.append('image', customerData.image);
        }
      } else if (customerData[key] !== null && customerData[key] !== undefined) {
        formData.append(key, customerData[key]);
      }
    });

    // Log FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

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
