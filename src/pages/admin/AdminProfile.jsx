"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../auth/AuthContext"
import { User, Mail, Phone, Camera, Calendar, MapPin, Building, LogOut, Shield, Info, AlertCircle } from "lucide-react"
import { getDateOnly } from "../../utils/dateUtils"
import AdminLayout from "../../components/admin/AdminLayout"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { getAdminInfo, updateAdminProfile } from "../../services/adminService"

const API_BASE_URL = "http://localhost:8084"

const AdminProfile = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    department: "",
    image: null,
    existingImage: null
  })

  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (!user?.id) {
          toast.error("User ID not found")
          setLoading(false)
          return
        }

        const data = await getAdminInfo(user.id)
        if (!data) {
          toast.error("No admin data found")
          setLoading(false)
          return
        }

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth ? getDateOnly(data.dateOfBirth) : "",
          address: data.address || "",
          department: data.department || "",
          image: null,
          existingImage: data.image || null
        })

        if (data.image) {
          if (!data.image.startsWith("http")) {
            setPreviewImage(`${API_BASE_URL}/uploads/images/${data.image}`)
          } else {
            setPreviewImage(data.image)
          }
        }
      } catch (error) {
        console.error("Error fetching admin data:", error)
        toast.error(error.message || "Failed to fetch profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [user])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }
      setProfile({ ...profile, image: file })
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    
    try {
      const updatedData = { ...profile }
      // If no new image is selected, don't include the image field at all
      // This will prevent the backend from processing any image updates
      if (!updatedData.image && updatedData.existingImage) {
        // Don't set updatedData.image to existingImage, just leave it out
        // The backend will keep the existing image
        delete updatedData.image;
      }
      
      await updateAdminProfile(user.id, updatedData)
      toast.success("Profile updated successfully")
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
      
      // Refresh admin data to ensure we have the latest info including image
      const refreshedData = await getAdminInfo(user.id);
      if (refreshedData) {
        // Update the image preview if needed
        if (refreshedData.image && !refreshedData.image.startsWith("http")) {
          setPreviewImage(`${API_BASE_URL}/uploads/images/${refreshedData.image}`);
        } else if (refreshedData.image) {
          setPreviewImage(refreshedData.image);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-white">Admin Profile</h2>
                <p className="mt-1 text-indigo-100">Manage your personal information and account settings</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all duration-300 border border-white border-opacity-20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                  <div className="relative">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Camera size={20} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-gray-800 text-lg">{profile.name}</h3>
                  <p className="text-gray-500 flex items-center justify-center mt-1">
                    <Shield size={16} className="text-indigo-500 mr-1" />
                    Administrator
                  </p>
                </div>
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 w-full">
                  <h4 className="font-semibold text-indigo-700 text-sm uppercase tracking-wider mb-2 flex items-center">
                    <Info size={16} className="mr-1" />
                    Account Info
                  </h4>
                  <p className="text-sm text-gray-600">
                    Department: <span className="font-semibold">{profile.department}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Member since: <span className="font-semibold">Jan 2023</span>
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-indigo-500" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-3 transition-all duration-200 bg-white hover:bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Email - Non-editable */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                      <span className="ml-2 text-xs text-gray-500">(Cannot be changed)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-indigo-500" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        readOnly
                        className="pl-10 w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700 py-3 cursor-not-allowed"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-indigo-500" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-3 transition-all duration-200 bg-white hover:bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-indigo-500" />
                      </div>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profile.dateOfBirth}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-3 transition-all duration-200 bg-white hover:bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-indigo-500" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-3 transition-all duration-200 bg-white hover:bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-indigo-500" />
                      </div>
                      <input
                        type="text"
                        name="department"
                        value={profile.department}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-3 transition-all duration-200 bg-white hover:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                      isSuccess
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    } ${isUpdating ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isUpdating ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : isSuccess ? (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Updated!
                      </span>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProfile