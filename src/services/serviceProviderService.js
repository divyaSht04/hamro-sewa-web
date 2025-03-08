import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getServiceProviderInfo = async (serviceProviderId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_BASE_URL}/serviceProvider/info/${serviceProviderId}`, {
      headers: getAuthHeaders()
    });

    // Backend returns a list with single provider, get the first item
    const providerData = Array.isArray(response.data) ? response.data[0] : response.data;
    console.log("Service Provider Info Response:", providerData);
    return providerData;
  } catch (error) {
    console.error("Error in getServiceProviderInfo:", error.response?.data || error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const updateServiceProviderProfile = async (serviceProviderId, providerData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    
    // Handle special fields
    const { image, serviceCategories, ...otherData } = providerData;

    // Add all other data as form fields
    Object.keys(otherData).forEach(key => {
      if (otherData[key] !== null && otherData[key] !== undefined) {
        formData.append(key, otherData[key]);
      }
    });

    // Handle image separately
    if (image instanceof File) {
      formData.append('image', image);
    }

    // Handle service categories
    if (serviceCategories) {
      if (Array.isArray(serviceCategories)) {
        serviceCategories.forEach(category => {
          formData.append('serviceCategories', category.trim());
        });
      } else if (typeof serviceCategories === 'string') {
        formData.append('serviceCategories', serviceCategories.trim());
      }
    }

    // Log the FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await axios.put(
      `${API_BASE_URL}/serviceProvider/edit-serviceProvider/${serviceProviderId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log("Update Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in updateServiceProviderProfile:", error.response?.data || error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};