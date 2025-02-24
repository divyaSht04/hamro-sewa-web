import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AuthForm } from "../../components/auth/AuthFrom"
import { getCustomerInfo, updateCustomerProfile } from "../../services/customerService"
import { useAuth } from "../../auth/AuthContext"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export function EditProfilePage() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Current user:", user) // Debug log
        console.log("Current user:", user) // Debug log
        if (!user?.id) {
          toast.error("User ID not found")
          setLoading(false)
          return
        }

        const data = await getCustomerInfo(user.id)
        console.log("Fetched customer data:", data) // Debug log

        if (!data || data.length === 0) {
          toast.error("No customer data found")
          setLoading(false)
          return
        }

        const customerInfo = data[0]
        setUserData({
          username: customerInfo.username || "",
          email: customerInfo.email || "",
          phoneNumber: customerInfo.phoneNumber || "",
          address: customerInfo.address || "",
          dateOfBirth: customerInfo.dateOfBirth || "",
          fullName: customerInfo.fullName || "",
          userType: "customer"
        })
      } catch (error) {
        console.error("Error fetching customer data:", error) // Debug log
        toast.error(error.message || "Failed to fetch profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleSubmit = async (updatedData) => {
    try {
      console.log("Submitting updated data:", updatedData) // Debug log
      await updateCustomerProfile(user.id, updatedData)
      toast.success("Profile updated successfully!")
      navigate("/customer/profile")
    } catch (error) {
      console.error("Error updating profile:", error) // Debug log
      toast.error(error.message || "Failed to update profile")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Debug log for render
  console.log("Rendering with userData:", userData)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Edit Profile</h1>
        {userData ? (
          <AuthForm 
            type="edit" 
            userType="customer" 
            initialData={userData} 
            onSubmit={handleSubmit} 
          />
        ) : (
          <div className="text-center text-gray-600">No profile data available</div>
        )}
      </motion.div>
    </div>
  )
}
