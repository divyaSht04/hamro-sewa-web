import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Lock, Mail, Eye, EyeOff, Calendar, Phone, Briefcase, Camera } from "lucide-react"
import LoadingSpinner from "../ui/LoadingSpinner.jsx"

export function AuthForm({ type, userType, initialData, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState(
    type === "edit" && initialData
      ? initialData
      : {
          email: "",
          password: "",
          username: "",
          dateOfBirth: "",
          phoneNumber: "",
          photo: null,
          ...(userType === "provider" && {
            serviceCategory: "",
            experience: "",
          }),
        },
  )
  const [photoPreview, setPhotoPreview] = useState(type === "edit" ? initialData?.photo : null)
  const fileInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (type === "edit" && initialData) {
      setFormData(initialData)
      setPhotoPreview(initialData.photo)
    }
  }, [type, initialData])

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0]
      setFormData({ ...formData, photo: file })
      setPhotoPreview(URL.createObjectURL(file))
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (type === "edit" && onSubmit) {
      onSubmit(formData)
    } else {
      console.log("Form submitted:", formData)
      // Add your authentication logic here
    }

    setIsLoading(false)
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
          {userType === "provider" && (
            <>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Service Category</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="gardening">Gardening</option>
                  <option value="painting">Painting</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Years of Experience"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </>
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
            accept="image/*"
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
                src={photoPreview || "/placeholder.svg"}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full"
              />
            </div>
          )}
        </div>
      )}
      {type === "login" && (
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
          <a href="#" className="text-primary hover:text-primary-dark">
            Forgot password?
          </a>
        </div>
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
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
