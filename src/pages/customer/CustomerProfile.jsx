"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext"
import { getCustomerInfo } from "../../services/customerService"
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi"
import toast from "react-hot-toast"

const API_BASE_URL = 'http://localhost:8084';

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
        console.log("Profile data:", data)
        if (!data || data.length === 0) {
          toast.error("No profile data found")
          setLoading(false)
          return
        }

        // Transform image URL if it exists
        const profileInfo = data[0];
        console.log("Profile info:", profileInfo)
        console.log(`${API_BASE_URL}/uploads/${profileInfo.image}`)
        console.log("Check  "+!profileInfo.image.startsWith('http'))
        console.log(profileInfo.image)
        if (profileInfo.image && !profileInfo.image.startsWith('http')) {
          profileInfo.image = `${API_BASE_URL}/uploads/${profileInfo.image}`;
          console.log("This is profile iinfo: "+ profileInfo.image)
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Banner and Profile Picture */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="absolute -bottom-16 w-full flex justify-center">
            <div className="relative">
              {profileData?.image && !imageError ? (
                <img
                  src={profileData.image}
                  alt={profileData?.fullName}
                  onError={handleImageError}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">
                    {profileData?.fullName?.charAt(0) || "U"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="pt-20 pb-8 px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{profileData?.fullName}</h1>
            <p className="text-gray-500 mt-1">@{profileData?.username}</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <FiMail className="w-6 h-6 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{profileData?.email}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <FiPhone className="w-6 h-6 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{profileData?.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <FiMapPin className="w-6 h-6 text-red-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900">{profileData?.address || "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <FiCalendar className="w-6 h-6 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Joined</p>
                <p className="text-gray-900">
                  {new Date(profileData?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-8">
            <button
              onClick={handleEditProfile}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-medium"
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
