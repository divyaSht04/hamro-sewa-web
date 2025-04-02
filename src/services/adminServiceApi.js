import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};


export const getAllServices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/provider-services/all`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all services:', error);
    throw error;
  }
};

/**
 * Get services by status
 * @param {string} status - The status to filter by (PENDING, APPROVED, REJECTED)
 * @returns {Promise<Array>} List of services with the specified status
 */
export const getServicesByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/provider-services/status/${status}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${status} services:`, error);
    throw error;
  }
};

export const approveService = async (serviceId, feedback = '') => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/provider-services/approve/${serviceId}`,
      null, // No request body
      {
        headers: getAuthHeaders(),
        params: { feedback }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error approving service:', error);
    throw error;
  }
};

export const rejectService = async (serviceId, feedback) => {
  try {
    if (!feedback || feedback.trim() === '') {
      throw new Error('Feedback is required when rejecting a service');
    }
    
    const response = await axios.put(
      `${API_BASE_URL}/provider-services/reject/${serviceId}`,
      null, // No request body
      {
        headers: getAuthHeaders(),
        params: { feedback }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting service:', error);
    throw error;
  }
};

// Helper function to get the image URL for a service
export const getServiceImageUrl = (serviceId) => {
  return `${API_BASE_URL}/provider-services/image/${serviceId}`;
};

// Helper function to get the image URL for a service provider
export const getServiceProviderImageUrl = (providerId) => {
  return `${API_BASE_URL}/service-providers/image/${providerId}`;
};

// Helper function to get the PDF URL for a service
export const getServicePdfUrl = (serviceId) => {
  return `${API_BASE_URL}/provider-services/pdf/${serviceId}`;
};
