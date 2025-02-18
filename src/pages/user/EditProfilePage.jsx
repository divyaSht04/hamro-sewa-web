import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AuthForm } from "../../components/auth/AuthFrom"

export function EditProfilePage() {
    const [userData, setUserData] = useState(null)
  
    useEffect(() => {
      // Fetch user data from API or local storage
      // This is a placeholder. Replace with actual data fetching logic
      const fetchedUserData = {
        username: "JohnDoe",
        email: "john@example.com",
        dateOfBirth: "1990-01-01",
        phoneNumber: "1234567890",
        photo: "/placeholder.svg", // Placeholder image URL
        userType: "customer", // or 'provider'
        // Add other fields as necessary
      }
      setUserData(fetchedUserData)
    }, [])
  
    const handleSubmit = (updatedData) => {
      // Handle form submission
      console.log("Updated user data:", updatedData)
      // Implement API call to update user data
      // You might want to show a success message here
    }
  
    if (!userData) {
      return <div>Loading...</div>
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Edit Profile</h1>
          <AuthForm type="edit" userType={userData.userType} initialData={userData} onSubmit={handleSubmit} />
        </motion.div>
      </div>
    )
  }