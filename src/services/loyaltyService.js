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
      `${API_BASE_URL}/loyalty/progress/${customerId}/${serviceProviderId}`,
      {
        headers: getAuthHeaders()
      }
    );
    
    const data = response.data;
    
    console.log(`Loyalty data for customer ${customerId} with provider ${serviceProviderId}:`, data);
    
    if (data.discountEligible === undefined && data.eligibleForDiscount !== undefined) {
      data.discountEligible = data.eligibleForDiscount;
    } else if (data.eligibleForDiscount === undefined && data.discountEligible !== undefined) {
      data.eligibleForDiscount = data.discountEligible;
    }
    
    if (data.completedBookings >= 4 && !data.discountEligible && !data.eligibleForDiscount) {
      data.discountEligible = true;
      data.eligibleForDiscount = true;
      console.log('Manually setting discount eligibility based on completed bookings count');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching loyalty progress:', error.response?.data || error.message);
    return {
      customerId,
      serviceProviderId,
      completedBookings: 0,
      bookingsNeededForDiscount: 4,
      eligibleForDiscount: false,
      discountEligible: false, 
      discountPercentage: 20,
      bookingsToDiscount: 4 // Default is 4 bookings needed
    };
  }
};

export const getAllLoyaltyProgress = async (customerId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/loyalty/progress/customer/${customerId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all loyalty progress:', error.response?.data || error.message);
    return [];
  }
};

export const fixLoyaltyTracking = async (customerId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/loyalty/fix/${customerId}`,
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
