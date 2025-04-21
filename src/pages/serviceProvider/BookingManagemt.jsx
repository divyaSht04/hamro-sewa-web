"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  CalendarCheck,
  X,
  Eye,
  Filter,
  ChevronDown,
  FileText,
  User,
  DollarSign,
  MapPin,
  RefreshCw,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import ServiceProviderLayout from "../../components/serviceProvider/ServiceProviderLayout"
import { useAuth } from "../../auth/AuthContext"
import toast from "react-hot-toast"
import { getProviderBookings, updateBookingStatus, cancelBooking } from "../../services/bookingService"
import { format } from "date-fns"
import { parseDate } from "../../utils/dateUtils"

function BookingManagement() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseType, setResponseType] = useState(null) // 'CONFIRMED' or 'CANCELLED' or 'COMPLETED'
  const [responseComment, setResponseComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage, setBookingsPerPage] = useState(5)

  const statuses = ["all", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]

  useEffect(() => {
    fetchBookings()
  }, [user?.id])

  const fetchBookings = async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getProviderBookings(user.id)
      console.log("Provider bookings:", data)
      setBookings(data || [])
      setFilteredBookings(data || [])
    } catch (err) {
      console.error("Failed to fetch bookings:", err)
      setError("Failed to load bookings. Please try again.")
      toast.error("Failed to load bookings")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Filter and sort bookings when filters or search term changes
    let filtered = [...bookings]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.customer?.firstName?.toLowerCase()?.includes(searchLower) ||
          "" ||
          booking.customer?.lastName?.toLowerCase()?.includes(searchLower) ||
          "" ||
          booking.providerService?.serviceName?.toLowerCase()?.includes(searchLower) ||
          "" ||
          booking.id?.toString()?.includes(searchLower) ||
          "",
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return parseDate(a.bookingDateTime, new Date(0)) - parseDate(b.bookingDateTime, new Date(0))
        case "date-desc":
          return parseDate(b.bookingDateTime, new Date(0)) - parseDate(a.bookingDateTime, new Date(0))
        case "created-asc":
          return parseDate(a.createdAt, new Date(0)) - parseDate(b.createdAt, new Date(0))
        case "created-desc":
          return parseDate(b.createdAt, new Date(0)) - parseDate(a.createdAt, new Date(0))
        default:
          return 0
      }
    })

    setFilteredBookings(filtered)
  }, [bookings, statusFilter, searchTerm, sortBy])

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking)
  }

  const closeBookingDetails = () => {
    setSelectedBooking(null)
  }

  const openResponseModal = (booking, type) => {
    setSelectedBooking(booking)
    setResponseType(type)
    setResponseComment("")
    setShowResponseModal(true)
  }

  const closeResponseModal = () => {
    setShowResponseModal(false)
    setResponseType(null)
    setResponseComment("")
  }

  const handleStatusUpdate = async () => {
    if (!selectedBooking || !responseType) return

    setIsSubmitting(true)

    try {
      let success = false

      // Check if this is a loyalty discounted booking being cancelled
      const isLoyaltyDiscountRejection = responseType === "CANCELLED" && selectedBooking.discountApplied

      if (responseType === "CANCELLED") {
        success = await cancelBooking(selectedBooking.id, responseComment, isLoyaltyDiscountRejection)
      } else {
        success = await updateBookingStatus(selectedBooking.id, responseType, responseComment)
      }

      if (success) {
        toast.success(`Booking ${responseType.toLowerCase()} successfully`)
        if (isLoyaltyDiscountRejection) {
          toast.info("Customer can still use their loyalty discount on another service from you")
        }
        closeResponseModal()
        await fetchBookings() // Refresh the bookings list
      }
    } catch (err) {
      console.error("Error updating booking status:", err)
      const errorMessage =
        err.response?.data?.message || err.response?.data || "Failed to update booking status. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "No date provided"

    try {
      // Use our utility function to properly parse array or string dates
      const dateObj = parseDate(dateTimeStr)
      return format(dateObj, "MMM d, yyyy 'at' h:mm a")
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Invalid date"
    }
  }

  const getStatusBadge = (status) => {
    if (!status) return null

    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock size={12} className="mr-1.5" />
            Pending
          </span>
        )
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle size={12} className="mr-1.5" />
            Confirmed
          </span>
        )
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle size={12} className="mr-1.5" />
            Completed
          </span>
        )
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle size={12} className="mr-1.5" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        )
    }
  }

  const getCustomerFullName = (customer) => {
    if (!customer) return "Unknown Customer"
    
    // If we're passed the fullName directly
    if (typeof customer === 'string') {
      return customer || "Unknown Customer"
    }
    
    // Otherwise extract from customer object
    if (customer.fullName) {
      return customer.fullName
    }
    
    const firstName = customer.firstName || ""
    const lastName = customer.lastName || ""
    
    return `${firstName} ${lastName}`.trim() || "Unknown Customer"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 border-yellow-100"
      case "CONFIRMED":
        return "bg-blue-50 border-blue-100"
      case "COMPLETED":
        return "bg-green-50 border-green-100"
      case "CANCELLED":
        return "bg-red-50 border-red-100"
      default:
        return "bg-gray-50 border-gray-100"
    }
  }

  // Update the renderBookingsList function to include pagination
  const renderBookingsList = () => {
    if (isLoading) {
      return (
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500 animate-pulse">Loading bookings...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-16 px-4">
          <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
          <p className="text-red-600 mb-6">We couldn't load your bookings at this time.</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      )
    }

    if (filteredBookings.length === 0) {
      return (
        <div className="text-center py-16 px-4">
          <CalendarCheck size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {statusFilter !== "all"
              ? `You don't have any ${statusFilter.toLowerCase()} bookings.`
              : "You don't have any bookings yet."}
          </p>
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors inline-flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Clear Filters
            </button>
          )}
        </div>
      )
    }

    // Calculate pagination
    const indexOfLastBooking = currentPage * bookingsPerPage
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)

    return (
      <>
        <div className="grid gap-4">
          {currentBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg border shadow-sm hover:shadow-md transition-all ${getStatusColor(booking.status)}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="hidden sm:flex h-10 w-10 rounded-full bg-white items-center justify-center mr-3 shadow-sm">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="text-base font-medium text-gray-900">
                          {booking.providerService?.serviceName || "Unknown Service"}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <User size={14} className="mr-1.5" />
                        <span>{getCustomerFullName(booking.customer)}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1.5" />
                        <span>{formatDateTime(booking.bookingDateTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                  <div className="flex items-center mr-4">
                    {booking?.discountApplied ? (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center">
                          <span className="line-through text-gray-400 mr-1 text-sm">
                            Rs. {booking.originalPrice?.toFixed(2)}
                          </span>
                          <span className="text-green-600 font-medium">Rs. {booking.discountedPrice?.toFixed(2)}</span>
                        </div>
                        <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Loyalty discount
                        </div>
                      </div>
                    ) : (
                      <div className="font-medium">
                        Rs. {booking.originalPrice?.toFixed(2) || booking.providerService?.price?.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewBooking(booking)}
                      className="px-3 py-1.5 bg-white text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors inline-flex items-center shadow-sm"
                    >
                      <Eye size={16} className="mr-1.5" />
                      Details
                    </button>

                    {booking.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => openResponseModal(booking, "CONFIRMED")}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center shadow-sm"
                        >
                          <CheckCircle size={16} className="mr-1.5" />
                          Confirm
                        </button>
                        <button
                          onClick={() => openResponseModal(booking, "CANCELLED")}
                          className="px-3 py-1.5 bg-red-100 text-red-600 border border-red-200 rounded-md hover:bg-red-200 transition-colors inline-flex items-center shadow-sm"
                        >
                          <XCircle size={16} className="mr-1.5" />
                          Reject
                        </button>
                      </>
                    )}

                    {booking.status === "CONFIRMED" && (
                      <button
                        onClick={() => openResponseModal(booking, "COMPLETED")}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-flex items-center shadow-sm"
                      >
                        <CalendarCheck size={16} className="mr-1.5" />
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {filteredBookings.length > bookingsPerPage && (
          <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-lg shadow-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50 border border-blue-200"
              }`}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50 border border-blue-200"
              }`}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        )}
      </>
    )
  }

  // Fixed booking details modal with proper event handling
  const renderBookingDetailsModal = () => {
    if (!selectedBooking) return null

    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop - click to close */}
          <div 
            className="fixed inset-0 transition-opacity" 
            aria-hidden="true" 
            onClick={closeBookingDetails}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-[110]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Booking Details</h3>
              <button
                onClick={closeBookingDetails}
                className="text-white hover:text-gray-200 focus:outline-none p-1 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Booking #{selectedBooking.id}</h4>
                    <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="text-sm font-medium">
                    {formatDateTime(selectedBooking.createdAt || selectedBooking.bookingDateTime)}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5">
                        <FileText size={20} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {selectedBooking.providerService?.serviceName || "Unknown Service"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      Rs
                      <div className="ml-3">
                        {selectedBooking?.discountApplied ? (
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <span className="line-through text-gray-400 mr-1">
                                 Rs. {selectedBooking.originalPrice?.toFixed(2)}
                              </span>
                              <span className="text-green-600 font-medium">
                                 Rs. {selectedBooking.discountedPrice?.toFixed(2)}
                              </span>
                            </div>
                            <div className="text-xs mt-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block">
                              Loyalty discount applied
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">
                            {" "}
                            {selectedBooking.originalPrice?.toFixed(2) ||
                              selectedBooking.providerService?.price?.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5">
                        <Clock size={20} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">{formatDateTime(selectedBooking.bookingDateTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Customer Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5">
                        <User size={20} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {getCustomerFullName(selectedBooking.customer)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5">
                        <Mail size={20} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">
                          {selectedBooking.customer?.email || "No email provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5">
                        <Phone size={20} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">
                          {console.log(selectedBooking)}
                          {selectedBooking.customer?.phoneNumber || "No phone provided"}
                        </p>
                      </div>
                    </div>

                    {selectedBooking.customer?.address && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5">
                          <MapPin size={20} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-900">{selectedBooking.customer.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {(selectedBooking.customerNotes || selectedBooking.providerResponse) && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Notes & Comments
                  </h4>

                  {selectedBooking.customerNotes && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                          <MessageSquare size={20} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 mb-1">Customer Notes</p>
                          <p className="text-sm text-gray-700">{selectedBooking.customerNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedBooking.providerResponse && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                          <MessageSquare size={20} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 mb-1">Your Response</p>
                          <p className="text-sm text-gray-700">{selectedBooking.providerResponse}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              {selectedBooking.status === "PENDING" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      closeBookingDetails()
                      openResponseModal(selectedBooking, "CONFIRMED")
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeBookingDetails()
                      openResponseModal(selectedBooking, "CANCELLED")
                    }}
                    className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                  >
                    Reject Booking
                  </button>
                </>
              )}

              {selectedBooking.status === "CONFIRMED" && (
                <button
                  type="button"
                  onClick={() => {
                    closeBookingDetails()
                    openResponseModal(selectedBooking, "COMPLETED")
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  Mark as Completed
                </button>
              )}

              <button
                type="button"
                onClick={closeBookingDetails}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const renderResponseModal = () => {
    if (!selectedBooking || !responseType) return null

    const isConfirmation = responseType === "CONFIRMED"
    const isCancellation = responseType === "CANCELLED"
    const isCompletion = responseType === "COMPLETED"

    const title = isConfirmation ? "Confirm Booking" : isCancellation ? "Reject Booking" : "Complete Booking"
    const description = isConfirmation
      ? "Are you sure you want to confirm this booking?"
      : isCancellation
        ? "Are you sure you want to reject this booking?"
        : "Are you sure you want to mark this booking as completed?"
    const confirmButtonText = isConfirmation
      ? "Confirm Booking"
      : isCancellation
        ? "Reject Booking"
        : "Mark as Completed"

    return (
      <div className="fixed inset-0 z-[200] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="fixed inset-0 transition-opacity" 
            aria-hidden="true" 
            onClick={closeResponseModal}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-[210]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <button onClick={closeResponseModal} className="text-white hover:text-gray-200 focus:outline-none">
                <X size={24} />
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-gray-700">{description}</p>

              {isCancellation && (
                <div className="mt-4">
                  <label htmlFor="responseComment" className="block text-sm font-medium text-gray-700">
                    Rejection Reason (Optional):
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="responseComment"
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Please provide a reason for rejecting this booking..."
                      value={responseComment}
                      onChange={(e) => setResponseComment(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeResponseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                onClick={handleStatusUpdate}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : confirmButtonText}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <ServiceProviderLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with title and filters */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Booking Management</h1>
            <p className="text-blue-100 mt-1">Manage and respond to your service bookings</p>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by customer name or service..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>

              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter size={16} className="mr-2 text-gray-500" />
                Filters
                <ChevronDown
                  size={16}
                  className={`ml-2 transition-transform duration-200 ${isFiltersOpen ? "transform rotate-180" : ""}`}
                />
              </button>
            </div>

            <AnimatePresence>
              {isFiltersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              statusFilter === status
                                ? status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : status === "CONFIRMED"
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : status === "COMPLETED"
                                      ? "bg-green-100 text-green-800 border border-green-200"
                                      : status === "CANCELLED"
                                        ? "bg-red-100 text-red-800 border border-red-200"
                                        : "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                            }`}
                          >
                            {status === "all" ? "All Statuses" : status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="date-desc">Date (Newest First)</option>
                        <option value="date-asc">Date (Oldest First)</option>
                        <option value="created-desc">Created (Newest First)</option>
                        <option value="created-asc">Created (Oldest First)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">{renderBookingsList()}</div>

        {/* Modals */}
        <AnimatePresence>
          {selectedBooking && !showResponseModal && renderBookingDetailsModal()}
          {showResponseModal && renderResponseModal()}
        </AnimatePresence>
      </div>
    </ServiceProviderLayout>
  )
}

export default BookingManagement