"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext"
import { getCustomerInfo } from "../../services/customerService"
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser } from "react-icons/fi"
import toast from "react-hot-toast"

const API_BASE_URL = "http://localhost:8084"

export function CustomerProfile() {
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user?.id) {
          toast.error("User ID not found")
          setLoading(false)
          return
        }

        const data = await getCustomerInfo(user.id)
        if (!data || data.length === 0) {
          toast.error("No profile data found")
          setLoading(false)
          return
        }

        const profileInfo = data[0]
        if (profileInfo.image && !profileInfo.image.startsWith("http")) {
          profileInfo.image = `${API_BASE_URL}/uploads/${profileInfo.image}`
        }

        setProfileData(profileInfo)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user])

  const handleEditProfile = () => {
    navigate("/customer/edit-profile")
  }

  const handleImageError = () => {
    console.log("Image failed to load")
    setImageError(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden relative z-10"
      >
        {/* Banner and Profile Picture */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute -bottom-16 w-full flex justify-center">
            <div className="relative">
              {profileData?.image && !imageError ? (
                <img
                  src={profileData.image || "/placeholder.svg"}
                  alt={profileData?.fullName}
                  onError={handleImageError}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                  <FiUser className="text-white text-4xl" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="pt-20 pb-8 px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{profileData?.fullName}</h1>
            <p className="text-indigo-600 mt-1">@{profileData?.username}</p>
          </div>

          <div className="space-y-6">
            <InfoItem icon={FiMail} color="text-blue-500" label="Email" value={profileData?.email} />
            <InfoItem icon={FiPhone} color="text-green-500" label="Phone" value={profileData?.phoneNumber} />
            <InfoItem
              icon={FiMapPin}
              color="text-red-500"
              label="Address"
              value={profileData?.address || "Not specified"}
            />
            <InfoItem
              icon={FiCalendar}
              color="text-purple-500"
              label="Joined"
              value={new Date(profileData?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </div>

          {/* Edit Profile Button */}
          <div className="mt-8">
            <button
              onClick={handleEditProfile}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center font-medium"
            >
              <FiEdit2 className="w-5 h-5 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function InfoItem({ icon: Icon, color, label, value }) {
  return (
    <div className="flex items-center p-4 bg-white bg-opacity-50 rounded-lg">
      <Icon className={`w-6 h-6 ${color}`} />
      <div className="ml-4">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-900">{value}</p>
      </div>
    </div>
  )
}

