// Service for handling loyalty program API calls

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

/**
 * Get a customer's loyalty progress with a specific service provider
 * 
 * @param {number} customerId - The customer ID
 * @param {number} serviceProviderId - The service provider ID
 * @returns {Promise<Object>} - Loyalty progress information
 */
export const getLoyaltyProgress = async (customerId, serviceProviderId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/loyalty/progress/${customerId}/${serviceProviderId}`,
      {
        headers: getAuthHeaders()
      }
    );
    
    // Process the response to ensure all required fields are present
    const data = response.data;
    
    // Log the response to help with debugging
    console.log(`Loyalty data for customer ${customerId} with provider ${serviceProviderId}:`, data);
    
    // Ensure both flag fields exist (for backward compatibility)
    if (data.discountEligible === undefined && data.eligibleForDiscount !== undefined) {
      data.discountEligible = data.eligibleForDiscount;
    } else if (data.eligibleForDiscount === undefined && data.discountEligible !== undefined) {
      data.eligibleForDiscount = data.discountEligible;
    }
    
    // Check completed bookings as a last resort
    if (data.completedBookings >= 4 && !data.discountEligible && !data.eligibleForDiscount) {
      data.discountEligible = true;
      data.eligibleForDiscount = true;
      console.log('Manually setting discount eligibility based on completed bookings count');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching loyalty progress:', error.response?.data || error.message);
    // Return default data structure in case of error
    return {
      customerId,
      serviceProviderId,
      completedBookings: 0,
      bookingsNeededForDiscount: 4,
      eligibleForDiscount: false,
      discountEligible: false, // Add the new flag
      discountPercentage: 20
    };
  }
};

/**
 * Get a customer's loyalty progress across all service providers
 * 
 * @param {number} customerId - The customer ID
 * @returns {Promise<Array>} - Array of loyalty progress information
 */
export const getAllLoyaltyProgress = async (customerId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/loyalty/progress/customer/${customerId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all loyalty progress:', error.response?.data || error.message);
    return []; // Return empty array in case of error
  }
};

/**
 * Fix loyalty tracking for a customer if there are issues
 * This will recalculate the loyalty status based on completed bookings
 * 
 * @param {number} customerId - The customer ID
 * @returns {Promise<Object>} - Result of the fix operation
 */
export const fixLoyaltyTracking = async (customerId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/loyalty/fix/${customerId}`,
      {},
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fixing loyalty tracking:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
};
