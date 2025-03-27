"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Check,
  AlertCircle,
  DollarSign,
  MapPin,
  User,
  ChevronRight,
  Shield,
} from "lucide-react"
import { getServiceById } from "../../services/providerServiceApi"
import { createBooking } from "../../services/bookingService"
import { useAuth } from "../../auth/AuthContext"

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Service-related state
  const [service, setService] = useState(null)
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Booking-related state
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingNotes, setBookingNotes] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState(null)

  // Form validation
  const [formErrors, setFormErrors] = useState({})
  const [formTouched, setFormTouched] = useState({
    date: false,
    time: false,
  })

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/login", { state: { from: `/booking/${id}` } })
      return
    }

    const fetchServiceData = async () => {
      try {
        setLoading(true)
        // Fetch service details
        const serviceData = await getServiceById(Number.parseInt(id))

        // Check if service is approved
        if (serviceData.status !== "APPROVED") {
          setError("This service is not available for booking at this time.")
          setLoading(false)
          return
        }

        setService(serviceData)

        // Fetch provider details if available
        if (serviceData.serviceProvider) {
          setProvider(serviceData.serviceProvider)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching service details:", err)
        setError("Unable to load service details. The service might not exist.")
        setLoading(false)
      }
    }

    fetchServiceData()
  }, [id, user, navigate])

  // Validate form fields
  const validateField = (name, value) => {
    let error = null

    if (name === "date") {
      if (!value) {
        error = "Please select a date"
      } else {
        const selectedDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (selectedDate < today) {
          error = "Please select a future date"
        }
      }
    }

    if (name === "time") {
      if (!value) {
        error = "Please select a time"
      }
    }

    return error
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "bookingDate") {
      setBookingDate(value)
      const error = validateField("date", value)
      setFormErrors((prev) => ({ ...prev, date: error }))
      setFormTouched((prev) => ({ ...prev, date: true }))
    } else if (name === "bookingTime") {
      setBookingTime(value)
      const error = validateField("time", value)
      setFormErrors((prev) => ({ ...prev, time: error }))
      setFormTouched((prev) => ({ ...prev, time: true }))
    } else if (name === "bookingNotes") {
      setBookingNotes(value)
    }
  }

  // Handle booking creation
  const handleBookService = async (e) => {
    e.preventDefault()

    // Validate all fields before submission
    const dateError = validateField("date", bookingDate)
    const timeError = validateField("time", bookingTime)

    setFormErrors({
      date: dateError,
      time: timeError,
    })

    setFormTouched({
      date: true,
      time: true,
    })

    if (dateError || timeError) {
      return
    }

    if (!user || !bookingDate || !bookingTime) return

    setBookingLoading(true)
    setBookingError(null)

    try {
      const bookingData = {
        customerId: user.id,
        providerServiceId: Number.parseInt(id),
        bookingDate: `${bookingDate}T${bookingTime}:00`, // Format as ISO date time
        notes: bookingNotes,
      }
      await createBooking(bookingData)

      setBookingSuccess(true)
      setTimeout(() => {
        navigate("/customer/bookings")
      }, 2000)
    } catch (err) {
      console.error("Error booking service:", err)
      setBookingError(err.response?.data || "Failed to book service. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  const handleBack = () => {
    navigate(`/services/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading booking page...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-red-500 mb-4">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Unavailable</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Service
        </button>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
        <p className="text-gray-600 mb-6">The service you're trying to book doesn't exist or has been removed.</p>
        <Link
          to="/services"
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Browse Services
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={22} className="text-gray-700" />
      </button>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Book Your Service</h1>
            <p className="text-purple-100 text-lg">Complete your booking for {service.serviceName}</p>
          </div>

          {/* Service summary */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-[200px]">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{service.serviceName}</h2>
                {provider && <p className="text-gray-600">Provided by {provider.name}</p>}

                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="w-5 h-5 text-purple-600 mr-1" />
                    <span className="font-medium">Rs. {service.price.toFixed(2)}</span>
                    {service.priceUnit && <span className="text-sm text-gray-500 ml-1">per {service.priceUnit}</span>}
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 text-purple-600 mr-1" />
                    <span>{service.durationHours ? `${service.durationHours} hours` : "Duration varies"}</span>
                  </div>

                  {service.location && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 text-purple-600 mr-1" />
                      <span>{service.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium flex items-center">
                <Check size={16} className="mr-1" />
                Available for Booking
              </div>
            </div>
          </div>

          {/* Booking form */}
          <div className="p-8">
            {bookingSuccess ? (
              <div className="bg-green-50 text-green-800 p-8 rounded-lg mb-4 text-center border border-green-200 animate-success">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="text-green-600" size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-medium mb-3">Booking Successful!</h3>
                <p className="text-green-700 mb-4">
                  Your booking has been confirmed. Redirecting to your bookings page...
                </p>
                <div className="mt-4 w-full bg-green-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ animation: "progress 2s ease-in-out forwards" }}
                  ></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookService} className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-staggered">
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900 border-b pb-2">Booking Details</h3>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="date"
                          name="bookingDate"
                          value={bookingDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                          required
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            formTouched.date && formErrors.date
                              ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {formTouched.date && formErrors.date && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="time"
                          name="bookingTime"
                          value={bookingTime}
                          onChange={handleInputChange}
                          required
                          className={`w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            formTouched.time && formErrors.time
                              ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {formTouched.time && formErrors.time && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.time}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                        <textarea
                          name="bookingNotes"
                          value={bookingNotes}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Add any specific requirements or questions..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900 border-b pb-2">Contact Information</h3>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center mb-3">
                        <User size={18} className="text-purple-600 mr-2" />
                        <h4 className="font-medium text-gray-800">Your Information</h4>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          Name: <span className="font-medium text-gray-800">{user.name || user.username}</span>
                        </p>
                        <p>
                          Email: <span className="font-medium text-gray-800">{user.email}</span>
                        </p>
                        {user.phone && (
                          <p>
                            Phone: <span className="font-medium text-gray-800">{user.phone}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        This information will be shared with the service provider.
                      </div>
                    </div>

                    {provider && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex items-center mb-3">
                          <User size={18} className="text-purple-600 mr-2" />
                          <h4 className="font-medium text-gray-800">Service Provider</h4>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            Name: <span className="font-medium text-gray-800">{provider.name}</span>
                          </p>
                          {provider.email && (
                            <p>
                              Email: <span className="font-medium text-gray-800">{provider.email}</span>
                            </p>
                          )}
                          {provider.phone && (
                            <p>
                              Phone: <span className="font-medium text-gray-800">{provider.phone}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {bookingError && (
                  <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 flex items-start border border-red-200">
                    <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
                    <p>{bookingError}</p>
                  </div>
                )}

                <div className="bg-blue-50 p-5 rounded-lg mb-6 flex items-start border border-blue-100">
                  <Shield className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Booking Information</p>
                    <p className="mb-2">
                      Your booking will be sent to the service provider for confirmation. You'll be notified once they
                      accept or reject your booking.
                    </p>
                    <p>Payment will be handled directly with the service provider after the service is completed.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={bookingLoading || !bookingDate || !bookingTime || formErrors.date || formErrors.time}
                    className={`flex-1 py-3.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 ${bookingLoading || !bookingDate || !bookingTime || formErrors.date || formErrors.time ? "opacity-50 cursor-not-allowed" : "shadow-md hover:shadow-lg hover:translate-y-[-2px]"}`}
                  >
                    {bookingLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Confirm Booking
                        <ChevronRight size={18} className="ml-1" />
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Service details summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Service Details</h3>
          <div className="prose max-w-none text-gray-600">
            <p>{service.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}