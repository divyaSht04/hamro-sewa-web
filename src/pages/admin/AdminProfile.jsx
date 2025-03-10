"use client"

import { useState, useRef } from "react"
import { useAuth } from "../../auth/AuthContext"
import { User, Mail, Phone, Camera, Calendar, MapPin, Building, LogOut, Shield, Info, AlertCircle } from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const AdminProfile = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

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
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    dateOfBirth: "1990-01-01",
    address: "123 Admin Street, City",
    department: "Service Management",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  })

  const [previewImage, setPreviewImage] = useState(profile.image)
  const fileInputRef = useRef(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        setProfile({ ...profile, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle profile update logic here
    console.log("Profile updated:", profile)
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 3000)
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
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-3 transition-all duration-200 bg-white hover:bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
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

                  <div>
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

                {/* Success Message */}
                {isSuccess && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center animate-fadeIn">
                    <div className="bg-emerald-100 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-emerald-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Profile updated successfully!</p>
                      <p className="text-sm text-emerald-600">Your changes have been saved.</p>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    Update Profile
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