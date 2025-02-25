import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../../auth/AuthContext"
import { getCustomerInfo, updateCustomerProfile } from "../../services/customerService"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { FiUser, FiMail, FiPhone, FiHome, FiCalendar, FiCamera } from "react-icons/fi"

const API_BASE_URL = 'http://localhost:8084';

export function EditProfilePage() {
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    email: "",
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?.id) {
          toast.error("User ID not found")
          setLoading(false)
          return
        }

        const data = await getCustomerInfo(user.id)
        if (!data || data.length === 0) {
          toast.error("No customer data found")
          setLoading(false)
          return
        }

        const customerInfo = data[0]
        
        setFormData({
          username: customerInfo.username || "",
          fullName: customerInfo.fullName || "",
          dateOfBirth: customerInfo.dateOfBirth ? customerInfo.dateOfBirth.split('T')[0] : "",
          phoneNumber: customerInfo.phoneNumber || "",
          address: customerInfo.address || "",
          email: customerInfo.email || "",
          image: null
        })
        
        // Set image preview if image exists
        if (customerInfo.image) {
          if (!customerInfo.image.startsWith('http')) {
            setImagePreview(`${API_BASE_URL}/uploads/${customerInfo.image}`)
          } else {
            setImagePreview(customerInfo.image)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error(error.message || "Failed to fetch profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB")
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Create a copy of formData
      const updatedData = { ...formData }
      await updateCustomerProfile(user.id, updatedData)
      toast.success("Profile updated successfully!")
      navigate("/customer/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-8">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                      setImagePreview(null);
                    }}
                  />
                ) : (
                  <span className="text-4xl text-gray-400">{formData.fullName?.charAt(0) || "U"}</span>
                )}
              </div>
              <label htmlFor="image" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                <FiCamera className="text-white" />
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <span className="text-sm text-gray-500 mt-2">Upload Photo (Max 5MB)</span>
          </div>

          {/* Username */}
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Username"
              required
            />
          </div>

          {/* Full Name */}
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Full Name"
              required
            />
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Phone Number"
              required
            />
          </div>

          {/* Address */}
          <div className="relative">
            <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Address"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
