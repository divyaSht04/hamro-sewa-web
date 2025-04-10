import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

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
      discountEligible: false, // Add the new flag
      discountPercentage: 20
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
    return []; // Return empty array in case of error
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
