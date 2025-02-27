import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ServiceProviderLayout from "../../components/serviceProvider/ServiceProviderLayout"
import { useAuth } from "../../auth/AuthContext"
import { getServiceProviderInfo, updateServiceProviderProfile } from "../../services/serviceProviderService"
import { 
  FiCamera, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiUser, 
  FiEdit2, 
  FiStar,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiBriefcase
} from "react-icons/fi"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = "http://localhost:8084"

export function ServiceProviderProfile() {
  const [profileData, setProfileData] = useState(null)
  const [editableData, setEditableData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user?.id) {
          toast.error("Please log in to view your profile");
          setLoading(false);
          return;
        }

        if (user.role !== 'ROLE_SERVICE_PROVIDER') {
          toast.error("Access denied. Only service providers can view this profile");
          setLoading(false);
          return;
        }

        const data = await getServiceProviderInfo(user.id);
        console.log("Fetched profile data:", data);

        if (!data) {
          toast.error("No profile data found. Please complete your profile setup.");
          setLoading(false);
          return;
        }

        // Ensure image URL is correctly formatted
        console.log("Image URL:", data, `${API_BASE_URL}/uploads/images/${data.image}`);
        if (data.image) {
          if (!data.image.startsWith('http') && !data.image.startsWith(API_BASE_URL)) {
            data.image = `${API_BASE_URL}/uploads/images/${data.image}`;
          }
        }

        // Set default values for missing fields
        const profileData = {
          username: data.username || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          businessName: data.businessName || '',
          image: data.image || null,
          serviceCategories: data.serviceCategories || []
        };

        setProfileData(profileData);
        setEditableData(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        const errorMessage = error.response?.data?.message || "Failed to load profile data";
        toast.error(errorMessage);
        
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }
      setImagePreview(URL.createObjectURL(file))
      setEditableData(prev => ({ ...prev, image: file }))
    }
  }

  const handleFieldEdit = (field) => {
    setEditingField(field)
  }

  const handleFieldSave = async (field) => {
    try {
      const updatedData = { ...profileData }
      updatedData[field] = editableData[field]

      // Special handling for service categories
      if (field === 'serviceCategories') {
        if (typeof editableData.serviceCategories === 'string') {
          updatedData.serviceCategories = editableData.serviceCategories.split(',').map(cat => cat.trim())
        } else {
          updatedData.serviceCategories = editableData.serviceCategories
        }
      }

      console.log("Updating field:", field, "with value:", updatedData[field])

      const response = await updateServiceProviderProfile(user.id, updatedData)
      console.log("Update response:", response)

      // Update the profile data with the response
      const newProfileData = { ...profileData, ...response }
      
      // Ensure image URL is correctly formatted in the response
      if (response.image && !response.image.startsWith('http') && !response.image.startsWith(API_BASE_URL)) {
        newProfileData.image = `${API_BASE_URL}/uploads/images/${response.image}`
      }

      setProfileData(newProfileData)
      setEditableData(newProfileData)
      setEditingField(null)
      if (field === 'image') {
        setImagePreview(null)
      }
      toast.success("Updated successfully!")
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1000) // 1 second delay to show the success message
    } catch (error) {
      console.error("Error updating field:", error)
      const errorMessage = error.response?.data?.message || "Failed to update"
      console.log("Error message:", errorMessage)
      toast.error(errorMessage)
      setEditableData(prev => ({ ...prev, [field]: profileData[field] }))
    }
  }

  const handleFieldCancel = (field) => {
    setEditableData(prev => ({ ...prev, [field]: profileData[field] }))
    setEditingField(null)
    if (field === 'image') {
      setImagePreview(null)
    }
  }

  const handleInputChange = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <ServiceProviderLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ServiceProviderLayout>
    )
  }

  if (!profileData) {
    return (
      <ServiceProviderLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700">Profile Not Found</h2>
            <p className="text-gray-500 mt-2">Unable to load profile data. Please try again later.</p>
          </div>
        </div>
      </ServiceProviderLayout>
    )
  }

  const renderProfileFields = () => (
    <div className="space-y-4">
      <EditableField
        field="username"
        value={editableData.username}
        isEditing={editingField === 'username'}
        onEdit={() => handleFieldEdit('username')}
        onSave={() => handleFieldSave('username')}
        onCancel={() => handleFieldCancel('username')}
        onChange={(value) => handleInputChange('username', value)}
        icon={FiUser}
      />
      <EditableField
        field="email"
        value={editableData.email}
        isEditing={false} // Always false to disable editing
        onEdit={() => {}} // Empty function
        onSave={() => {}} // Empty function
        onCancel={() => {}} // Empty function
        onChange={() => {}} // Empty function
        icon={FiMail}
        className="opacity-70" // Add visual indication that it's disabled
      />
      <EditableField
        field="phoneNumber"
        value={editableData.phoneNumber}
        isEditing={editingField === 'phoneNumber'}
        onEdit={() => handleFieldEdit('phoneNumber')}
        onSave={() => handleFieldSave('phoneNumber')}
        onCancel={() => handleFieldCancel('phoneNumber')}
        onChange={(value) => handleInputChange('phoneNumber', value)}
        icon={FiPhone}
      />
      <EditableField
        field="address"
        value={editableData.address}
        isEditing={editingField === 'address'}
        onEdit={() => handleFieldEdit('address')}
        onSave={() => handleFieldSave('address')}
        onCancel={() => handleFieldCancel('address')}
        onChange={(value) => handleInputChange('address', value)}
        icon={FiMapPin}
      />
      <EditableField
        field="businessName"
        value={editableData.businessName}
        isEditing={editingField === 'businessName'}
        onEdit={() => handleFieldEdit('businessName')}
        onSave={() => handleFieldSave('businessName')}
        onCancel={() => handleFieldCancel('businessName')}
        onChange={(value) => handleInputChange('businessName', value)}
        icon={FiBriefcase}
      />
    </div>
  )

  return (
    <ServiceProviderLayout>
      <div className="min-h-[80vh] bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-24"></div>
            </div>

            {/* Profile Section */}
            <div className="relative px-8 pb-8">
              {/* Profile Image */}
              <div className="relative -mt-20 mb-4">
                <div className="relative w-40 h-40 mx-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-xl"
                  >
                    <img
                      src={imagePreview || profileData.image || "/placeholder.svg"}
                      alt={profileData.businessName || "Profile"}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full transform hover:scale-110 transition-transform"
                      >
                        <FiCamera className="w-6 h-6 text-gray-700" />
                      </button>
                    </div>
                  </motion.div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {imagePreview && (
                    <div className="absolute top-0 right-0 mt-2 space-x-2">
                      <button
                        onClick={() => handleFieldSave('image')}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFieldCancel('image')}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Info */}
              <div className="text-center mb-8">
                <EditableField
                  field="businessName"
                  value={editableData.businessName}
                  isEditing={editingField === 'businessName'}
                  onEdit={() => handleFieldEdit('businessName')}
                  onSave={() => handleFieldSave('businessName')}
                  onCancel={() => handleFieldCancel('businessName')}
                  onChange={(value) => handleInputChange('businessName', value)}
                  className="text-3xl font-bold text-gray-800"
                />
                <EditableField
                  field="username"
                  value={editableData.username}
                  isEditing={editingField === 'username'}
                  onEdit={() => handleFieldEdit('username')}
                  onSave={() => handleFieldSave('username')}
                  onCancel={() => handleFieldCancel('username')}
                  onChange={(value) => handleInputChange('username', value)}
                  className="text-lg text-gray-600"
                />
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={FiStar} value={profileData.rating || "0.0"} label="Rating" color="text-yellow-500" />
                <StatCard icon={FiCheckCircle} value={profileData.completedJobs || "0"} label="Jobs Done" color="text-green-500" />
                <StatCard icon={FiTrendingUp} value={profileData.successRate || "0%"} label="Success Rate" color="text-blue-500" />
                <StatCard icon={FiAward} value={profileData.status || "New"} label="Status" color="text-purple-500" />
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                  {renderProfileFields()}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Service Details</h3>
                  <EditableField
                    field="serviceCategories"
                    value={Array.isArray(editableData.serviceCategories) ? editableData.serviceCategories.join(", ") : editableData.serviceCategories || ""}
                    isEditing={editingField === 'serviceCategories'}
                    onEdit={() => handleFieldEdit('serviceCategories')}
                    onSave={() => handleFieldSave('serviceCategories')}
                    onCancel={() => handleFieldCancel('serviceCategories')}
                    onChange={(value) => handleInputChange('serviceCategories', value)}
                    icon={<FiBriefcase />}
                  />
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-blue-500" />
                      <span className="text-gray-600">Available: Mon-Fri, 9AM-6PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-green-500" />
                      <span className="text-gray-600">Member since {new Date(profileData.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-purple-500" />
                      <span className="text-gray-600">Verified Provider</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ServiceProviderLayout>
  )
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 rounded-xl p-4 flex items-center gap-3"
    >
      <div className={`${color}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </motion.div>
  )
}

function EditableField({ field, value, isEditing, onEdit, onSave, onCancel, onChange, icon, type = "text", className = "" }) {
  return (
    <div className="relative group">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
              {icon && <span className="text-gray-400">{icon}</span>}
              <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none"
                placeholder={`Enter ${field}`}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSave}
                className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 rounded-xl group-hover:bg-gray-50 transition-colors"
          >
            {icon && <span className="text-gray-400">{icon}</span>}
            <span className={className || "text-gray-700"}>{value}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={onEdit}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiEdit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}