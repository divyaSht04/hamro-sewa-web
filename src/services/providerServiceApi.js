import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

// Helper function to get auth headers for JSON requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to get auth headers for multipart/form-data requests
const getMultipartAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
    // Don't set Content-Type here, axios will set it with the correct boundary for multipart/form-data
  };
};

// Create a new service
export const createProviderService = async (serviceData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    
    // Add all the service data to the form
    formData.append('serviceProviderId', serviceData.serviceProviderId);
    formData.append('serviceName', serviceData.serviceName);
    formData.append('description', serviceData.description);
    formData.append('price', serviceData.price);
    formData.append('category', serviceData.category);
    
    // Add files if they exist
    if (serviceData.pdf) {
      formData.append('pdf', serviceData.pdf);
    }
    
    if (serviceData.image) {
      formData.append('image', serviceData.image);
    }

    const response = await axios.post(
      `${API_BASE_URL}/provider-services`,
      formData,
      {
        headers: getMultipartAuthHeaders()
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating service:', error.response?.data || error.message);
    throw error;
  }
};

// Update an existing service
export const updateProviderService = async (serviceId, serviceData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    
    // Add all the service data to the form
    formData.append('serviceProviderId', serviceData.serviceProviderId);
    formData.append('serviceName', serviceData.serviceName);
    formData.append('description', serviceData.description);
    formData.append('price', serviceData.price);
    formData.append('category', serviceData.category);
    
    // Add files if they exist
    if (serviceData.pdf) {
      formData.append('pdf', serviceData.pdf);
    }
    
    if (serviceData.image) {
      formData.append('image', serviceData.image);
    }

    const response = await axios.put(
      `${API_BASE_URL}/provider-services/${serviceId}`,
      formData,
      {
        headers: getMultipartAuthHeaders()
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating service:', error.response?.data || error.message);
    throw error;
  }
};

// Get services for a specific provider
export const getProviderServices = async (providerId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `${API_BASE_URL}/provider-services/provider/${providerId}`,
      {
        headers: getAuthHeaders()
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching provider services:', error.response?.data || error.message);
    throw error;
  }
};

// Get a specific service by ID
export const getServiceById = async (serviceId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `${API_BASE_URL}/provider-services/${serviceId}`,
      {
        headers: getAuthHeaders()
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching service details:', error.response?.data || error.message);
    throw error;
  }
};

// Delete a service
export const deleteService = async (serviceId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.delete(
      `${API_BASE_URL}/provider-services/${serviceId}`,
      {
        headers: getAuthHeaders()
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error.response?.data || error.message);
    throw error;
  }
};

// Get the image URL for a service
export const getServiceImageUrl = (serviceId) => {
  return `${API_BASE_URL}/provider-services/image/${serviceId}`;
};

// Get the PDF URL for a service
export const getServicePdfUrl = (serviceId) => {
  return `${API_BASE_URL}/provider-services/pdf/${serviceId}`;
};

// Get services by status
export const getServicesByStatus = async (status) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/provider-services/status/${status}`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching services by status:', error.response?.data || error.message);
    throw error;
  }
};

// Get all approved services
export const getApprovedServices = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/provider-services/approved`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching approved services:', error.response?.data || error.message);
    throw error;
  }
};
