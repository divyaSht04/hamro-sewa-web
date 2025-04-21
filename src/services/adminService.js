import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084';

export const getAdminInfo = async (adminId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/info/${adminId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error in getAdminInfo:", error);
    throw new Error(error.response?.data?.message || 'Failed to fetch admin information');
  }
};

export const updateAdminProfile = async (adminId, adminData) => {
  try {
    const formData = new FormData();
    
    Object.keys(adminData).forEach(key => {
      if (key === 'image') {
        if (adminData.image instanceof File) {
          formData.append('image', adminData.image);
        }
      } else if (key !== 'existingImage' && adminData[key] !== null && adminData[key] !== undefined) {
        formData.append(key, adminData[key]);
      }
    });

    const response = await axios.put(
      `${API_BASE_URL}/admin/edit-admin/${adminId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in updateAdminProfile:", error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

/**
 * Fetch admin dashboard metrics from the backend API
 * @returns {Promise<Object>} Dashboard metrics including totalUsers, totalServiceProviders, totalRevenue, and averageRating
 */
export const getAdminDashboardMetrics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard-metrics`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard metrics:", error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard metrics');
  }
};
