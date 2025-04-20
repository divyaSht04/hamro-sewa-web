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

// Get reviews for a specific service
export const getServiceReviews = async (serviceId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reviews/service/${serviceId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching service reviews:', error.response?.data || error.message);
    throw error;
  }
};

// Get average rating for a service
export const getServiceAverageRating = async (serviceId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reviews/service/${serviceId}/rating`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching service average rating:', error.response?.data || error.message);
    return null;
  }
};

// Create a new review
export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/reviews`,
      reviewData,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error.response?.data || error.message);
    throw error;
  }
};

// Update an existing review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/reviews/${reviewId}`,
      reviewData,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error.response?.data || error.message);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId, customerId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/reviews/${reviewId}?customerId=${customerId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error.response?.data || error.message);
    throw error;
  }
};

// Get reviews by customer ID
export const getCustomerReviews = async (customerId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reviews/customer/${customerId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching customer reviews:', error.response?.data || error.message);
    throw error;
  }
};

// Get a review by booking ID
export const getReviewByBookingId = async (bookingId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reviews/booking/${bookingId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching review by booking ID:', error.response?.data || error.message);
    throw error;
  }
};
