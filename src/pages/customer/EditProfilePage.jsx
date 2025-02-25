"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../../auth/AuthContext"
import { getCustomerInfo, updateCustomerProfile } from "../../services/customerService"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { FiUser, FiMail, FiPhone, FiHome, FiCalendar, FiCamera } from "react-icons/fi"

const API_BASE_URL = "http://localhost:8084"

export function EditProfilePage() {
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    email: "",
    image: null,
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
          dateOfBirth: customerInfo.dateOfBirth ? customerInfo.dateOfBirth.split("T")[0] : "",
          phoneNumber: customerInfo.phoneNumber || "",
          address: customerInfo.address || "",
          email: customerInfo.email || "",
          image: null,
        })

        if (customerInfo.image) {
          if (!customerInfo.image.startsWith("http")) {
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
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }
      setFormData((prev) => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-xl p-8 w-full max-w-md relative z-10"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = ""
                      setImagePreview(null)
                    }}
                  />
                ) : (
                  <FiUser className="text-white text-5xl" />
                )}
              </div>
              <label
                htmlFor="image"
                className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-3 cursor-pointer hover:bg-blue-600 transition-colors"
              >
                <FiCamera className="text-white text-xl" />
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

          <InputField
            icon={FiUser}
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            color="text-blue-500"
          />
          <InputField
            icon={FiUser}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            color="text-green-500"
          />
          <InputField
            icon={FiCalendar}
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            type="date"
            max={new Date().toISOString().split("T")[0]}
            color="text-purple-500"
          />
          <InputField
            icon={FiPhone}
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            color="text-yellow-500"
          />
          <InputField
            icon={FiHome}
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            color="text-red-500"
          />
          <InputField
            icon={FiMail}
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            color="text-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium text-lg ${
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

function InputField({ icon: Icon, name, value, onChange, placeholder, type = "text", required = false, max, color }) {
  return (
    <div className="relative">
      <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 ${color}`} />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        placeholder={placeholder}
        required={required}
        max={max}
      />
    </div>
  )
}

