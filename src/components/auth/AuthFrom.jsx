import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Lock, Mail, Eye, EyeOff, Calendar, Phone, Briefcase, Camera, Home, Building, UserCircle } from "lucide-react"
import LoadingSpinner from "../ui/LoadingSpinner.jsx"

export function AuthForm({ type, userType, initialData, onSubmit, isLoading, error }) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState(
    type === "edit" && initialData
      ? initialData
      : {
          email: "",
          password: "",
          username: "",
          phoneNumber: "",
          address: "",
          photo: null,
          ...(userType === "customer" && {
            fullName: "",
            dateOfBirth: "",
          }),
          ...(userType === "provider" && {
            businessName: "",
          }),
        },
  )
  const [photoPreview, setPhotoPreview] = useState(type === "edit" ? initialData?.photo : null)
  const fileInputRef = useRef(null)
  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    if (type === "edit" && initialData) {
      setFormData(initialData)
      setPhotoPreview(initialData.photo)
    }
  }, [type, initialData])

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert("File size should not exceed 5MB")
          return
        }
        if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
          alert("Only JPEG, PNG, GIF and WEBP images are allowed")
          return
        }
        setFormData({ ...formData, photo: file })
        setPhotoPreview(URL.createObjectURL(file))
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalLoading(true)
    try {
      if (onSubmit) {
        await onSubmit(formData)
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {(type === "register" || type === "edit") && (
        <>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          {userType === "customer" && (
            <>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  placeholder="Date of Birth"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </>
          )}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          {userType === "provider" && (
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Business Name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          )}
        </>
      )}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      {type !== "edit" && (
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      )}
      {(type === "register" || type === "edit") && (
        <div className="relative">
          <input
            type="file"
            name="photo"
            onChange={handleChange}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            ref={fileInputRef}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Camera className="mr-2" size={18} />
            {photoPreview ? "Change Photo" : "Upload Photo"}
          </button>
          {photoPreview && (
            <div className="mt-2 flex justify-center">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full"
              />
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center"
        disabled={isLoading || localLoading}
      >
        {(isLoading || localLoading) ? (
          <>
            <LoadingSpinner size="w-5 h-5 mr-2" />
            {type === "login" ? "Signing In..." : type === "register" ? "Creating Account..." : "Updating Profile..."}
          </>
        ) : type === "login" ? (
          "Sign In"
        ) : type === "register" ? (
          "Create Account"
        ) : (
          "Update Profile"
        )}
      </motion.button>
    </motion.form>
  )
}
