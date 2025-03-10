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
        // Skip the existingImage field as it's only used on the frontend
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
