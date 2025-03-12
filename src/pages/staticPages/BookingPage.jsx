"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  ChevronRight,
  User,
  Phone,
  Mail,
  FileText,
  Home,
  Building,
  CalendarCheck,
  Shield,
} from "lucide-react"
import { services } from "./ServicePage"

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    address: "",
    city: "",
    zipCode: "",
    instructions: "",
    name: "",
    phone: "",
    email: "",
    paymentMethod: "cash",
    termsAccepted: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  // Available time slots
  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ]

  useEffect(() => {
    // Simulate loading data
    setLoading(true)
    setTimeout(() => {
      const foundService = services.find((s) => s.id === Number.parseInt(id))
      setService(foundService)
      setLoading(false)
    }, 500)
  }, [id])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.date) newErrors.date = "Please select a date"
      if (!formData.time) newErrors.time = "Please select a time"
      if (!formData.address) newErrors.address = "Please enter your address"
      if (!formData.city) newErrors.city = "Please enter your city"
      if (!formData.zipCode) newErrors.zipCode = "Please enter your ZIP code"
    } else if (step === 2) {
      if (!formData.name) newErrors.name = "Please enter your name"
      if (!formData.phone) newErrors.phone = "Please enter your phone number"
      if (!formData.email) newErrors.email = "Please enter your email"
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
    } else if (step === 3) {
      if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateStep(currentStep)) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        setBookingComplete(true)
        setBookingReference(`HM${Math.floor(100000 + Math.random() * 900000)}`)
      }, 1500)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
        <p className="text-gray-600 mb-6">The service you're trying to book doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Services
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Back button */}
      <button
        onClick={() => navigate(`/service-details/${id}`)}
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={22} className="text-gray-700" />
      </button>

      <div className="container mx-auto px-4 py-16">
        {bookingComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-purple-100"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">Booking Confirmed!</h1>
              <p className="text-gray-600 max-w-md">
                Your booking has been successfully confirmed. We've sent a confirmation email with all the details.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8 border border-purple-100">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
                <CalendarCheck className="w-5 h-5 mr-2 text-purple-600" />
                Booking Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Reference Number:</span>
                  <span className="font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full text-sm">
                    {bookingReference}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(formData.date)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{formData.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right">
                    {formData.address}, {formData.city}, {formData.zipCode}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg text-purple-600">$110.00</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 mt-0.5">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">What's Next?</h3>
                  <p className="text-blue-700 text-sm">
                    The service provider will contact you before the appointment to confirm. You can pay with cash when
                    the service is completed.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Return to Home
              </button>
              <button
                onClick={() => navigate("/services")}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Book Another Service
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Book Your Service</h1>
            <p className="text-gray-600 mb-8 text-center">Complete the form below to book {service.name}</p>

            {/* Progress steps */}
            <div className="flex justify-between mb-10 relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-purple-600 -translate-y-1/2 z-0"
                style={{ width: `${(currentStep - 1) * 50}%` }}
              ></div>

              {[1, 2, 3].map((step) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"
                    } transition-all duration-300 shadow-md`}
                  >
                    {currentStep > step ? (
                      <CheckCircle size={22} />
                    ) : step === 1 ? (
                      <Calendar size={20} />
                    ) : step === 2 ? (
                      <User size={20} />
                    ) : (
                      <DollarSign size={20} />
                    )}
                  </div>
                  <span
                    className={`mt-3 text-sm font-medium ${currentStep >= step ? "text-purple-600" : "text-gray-500"}`}
                  >
                    {step === 1 ? "Service Details" : step === 2 ? "Contact Info" : "Payment"}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-100">
              {/* Service summary */}
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl mb-8 border border-purple-100">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-20 h-20 object-cover rounded-lg shadow-md"
                />
                <div>
                  <h2 className="font-bold text-gray-900 text-xl">{service.name}</h2>
                  <p className="text-gray-600 text-sm">Provided by {service.provider}</p>
                  <div className="flex items-center mt-2">
                    <span className="font-medium text-purple-600 text-lg">{service.price}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600 text-sm">{service.duration}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Service Details */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                      Service Details
                    </h3>

                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Select Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                            errors.date ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Select Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white ${
                            errors.time ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select a time slot</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <ChevronRight
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400"
                          size={18}
                        />
                      </div>
                      {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Service Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="address"
                          placeholder="Street address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.address ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.city ? "border-red-300 bg-red-50" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <input
                            type="text"
                            name="zipCode"
                            placeholder="ZIP Code"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              errors.zipCode ? "border-red-300 bg-red-50" : "border-gray-300"
                            }`}
                          />
                        </div>
                        {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Special Instructions (Optional)
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                        <textarea
                          name="instructions"
                          placeholder="Any special requirements or instructions for the service provider"
                          value={formData.instructions}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                      >
                        Next Step
                        <ChevronRight size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                      <User className="w-5 h-5 mr-2 text-purple-600" />
                      Contact Information
                    </h3>

                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    <div className="mb-8">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="email"
                          placeholder="Your email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handlePrevStep}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <ArrowLeft size={18} />
                        Previous
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                      >
                        Next Step
                        <ChevronRight size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                      Payment Details
                    </h3>

                    <div className="mb-8">
                      <label className="block text-gray-700 text-sm font-medium mb-3">Payment Method</label>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 mb-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={formData.paymentMethod === "cash"}
                            onChange={handleInputChange}
                            className="mr-3 h-5 w-5 text-green-600 focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <span className="font-medium text-gray-800">Cash on Delivery</span>
                            <p className="text-sm text-gray-600 mt-1">
                              Pay with cash after the service is completed to your satisfaction
                            </p>
                          </div>
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </label>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8 border border-purple-100">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-purple-600" />
                        Order Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{service.name}</span>
                          <span>{service.price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Service Fee</span>
                          <span>$10.00</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between items-center font-bold">
                            <span>Total</span>
                            <span className="text-purple-600 text-xl">$110.00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          className="mt-1 mr-3 h-5 w-5 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the{" "}
                          <a href="#" className="text-purple-600 hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-purple-600 hover:underline">
                            Privacy Policy
                          </a>
                          . I understand that my personal data will be processed as described in the Privacy Policy.
                        </span>
                      </label>
                      {errors.termsAccepted && <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>}
                    </div>

                    <div className="flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handlePrevStep}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <ArrowLeft size={18} />
                        Previous
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md disabled:bg-purple-400 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            Confirm Booking
                            <CheckCircle size={18} />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}