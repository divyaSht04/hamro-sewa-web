// This is a real service for handling booking-related API calls

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

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/bookings`,
      bookingData,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error.response?.data || error.message);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/bookings/${bookingId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details:', error.response?.data || error.message);
    throw error;
  }
};

// Get all bookings for a customer
export const getCustomerBookings = async (customerId) => {
  try {
    // Ensure customerId is properly converted to a number
    const numericCustomerId = Number(customerId);
    
    console.log('Fetching bookings for customer ID:', numericCustomerId);
    
    const response = await axios.get(
      `${API_BASE_URL}/bookings/customer/${numericCustomerId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching customer bookings:', error.response?.data || error.message);
    return []; // Return empty array instead of throwing
  }
};

// Get all bookings for a service
export const getServiceBookings = async (serviceId) => {
  try {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Return empty array if not authenticated
      return [];
    }
    
    const response = await axios.get(
      `${API_BASE_URL}/bookings/service/${serviceId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching service bookings:', error.response?.data || error.message);
    return []; // Return empty array instead of throwing
  }
};

// Get all bookings for a provider
export const getProviderBookings = async (providerId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/bookings/provider/${providerId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching provider bookings:', error.response?.data || error.message);
    return []; 
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/bookings/${bookingId}/status?status=${status}`,
      {},
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error.response?.data || error.message);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/bookings/${bookingId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error.response?.data || error.message);
    throw error;
  }
};

// Check if a booking has been reviewed
export const checkBookingReviewStatus = async (bookingId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/reviews/booking/${bookingId}/exists`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking booking review status:', error.response?.data || error.message);
    return false;
  }
};