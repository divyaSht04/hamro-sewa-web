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

    const response = await axios.get(`${API_BASE_URL}/service-providers/info/${serviceProviderId}`, {
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
      `${API_BASE_URL}/service-providers/edit-serviceProvider/${serviceProviderId}`,
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

// Dashboard metrics API methods
export const getDashboardMetrics = async (providerId, startDate, endDate) => {
  try {
    let url = `${API_BASE_URL}/service-providers/dashboard-metrics/${providerId}`;
    
    // Add date parameters if provided
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error.response?.data || error);
    throw error;
  }
};

export const getPerformanceMetrics = async (providerId, startDate, endDate) => {
  try {
    let url = `${API_BASE_URL}/service-providers/performance-metrics/${providerId}`;
    
    // Add date parameters if provided
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching performance metrics:", error.response?.data || error);
    throw error;
  }
};

export const getMonthlyEarnings = async (providerId, year) => {
  try {
    let url = `${API_BASE_URL}/service-providers/monthly-earnings/${providerId}`;
    
    // Add year parameter if provided
    if (year) {
      url += `?year=${year}`;
    }
    
    const response = await axios.get(url, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly earnings:", error.response?.data || error);
    throw error;
  }
};

export const getClientGrowth = async (providerId, year) => {
  try {
    let url = `${API_BASE_URL}/service-providers/client-growth/${providerId}`;
    
    // Add year parameter if provided
    if (year) {
      url += `?year=${year}`;
    }
    
    const response = await axios.get(url, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching client growth:", error.response?.data || error);
    throw error;
  }
};

export const getServicePopularity = async (providerId) => {
  try {
    const url = `${API_BASE_URL}/service-providers/service-popularity/${providerId}`;
    
    const response = await axios.get(url, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching service popularity:", error.response?.data || error);
    throw error;
  }
};