import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

// Helper function to get auth headers for JSON requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Get all services (for admin)
 * @returns {Promise<Array>} List of all services
 */
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

/**
 * Approve a service
 * @param {number} serviceId - ID of the service to approve
 * @param {string} feedback - Optional feedback from admin
 * @returns {Promise<Object>} The updated service
 */
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

/**
 * Reject a service
 * @param {number} serviceId - ID of the service to reject
 * @param {string} feedback - Feedback explaining why the service was rejected
 * @returns {Promise<Object>} The updated service
 */
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

// Helper function to get the PDF URL for a service
export const getServicePdfUrl = (serviceId) => {
  return `${API_BASE_URL}/provider-services/pdf/${serviceId}`;
};
