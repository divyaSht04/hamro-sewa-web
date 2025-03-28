"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Search,
  ChevronDown,
  MessageSquare,
  DollarSign,
  CalendarCheck,
  X,
  Eye,
} from "lucide-react"
import ServiceProviderLayout from "../../components/serviceProvider/ServiceProviderLayout"
import { useAuth } from "../../auth/AuthContext"
import toast from "react-hot-toast"
import { getProviderBookings, updateBookingStatus, cancelBooking } from "../../services/bookingService"
import { format } from "date-fns"

export function BookingManagement() {
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

  useEffect(() => {
    fetchBookings()
  }, [user?.id])

  const fetchBookings = async () => {
    if (!user?.id) return;
    
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getProviderBookings(user.id)
      console.log('Provider bookings:', data)
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
          (booking.customer?.firstName?.toLowerCase()?.includes(searchLower) || '') ||
          (booking.customer?.lastName?.toLowerCase()?.includes(searchLower) || '') ||
          (booking.providerService?.serviceName?.toLowerCase()?.includes(searchLower) || '') ||
          (booking.id?.toString()?.includes(searchLower) || '')
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.bookingDateTime || 0) - new Date(b.bookingDateTime || 0)
        case "date-desc":
          return new Date(b.bookingDateTime || 0) - new Date(a.bookingDateTime || 0)
        case "created-asc":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        case "created-desc":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        default:
          return new Date(b.bookingDateTime || 0) - new Date(a.bookingDateTime || 0)
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
    if (!selectedBooking?.id || !responseType) return
    
    setIsSubmitting(true)
    
    try {
      await updateBookingStatus(selectedBooking.id, responseType)
      
      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: responseType } 
          : booking
      )
      
      setBookings(updatedBookings)
      closeResponseModal()
      const statusMessage = {
        'CONFIRMED': 'accepted',
        'CANCELLED': 'rejected',
        'COMPLETED': 'marked as complete'
      }
      toast.success(`Booking ${statusMessage[responseType] || responseType.toLowerCase()} successfully`)
    } catch (error) {
      const statusMessage = {
        'CONFIRMED': 'accepting',
        'CANCELLED': 'rejecting',
        'COMPLETED': 'completing'
      }
      console.error(`Error ${statusMessage[responseType] || responseType.toLowerCase()} booking:`, error)
      toast.error(`Failed to ${statusMessage[responseType] || responseType.toLowerCase()} booking`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    
    try {
      const date = new Date(dateTimeStr);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateTimeStr;
    }
  }

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        )
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle size={12} className="mr-1" />
            Confirmed
          </span>
        )
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        )
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  const getCustomerFullName = (customer) => {
    if (!customer) return 'Unknown Customer';
    
    const firstName = customer.firstName || '';
    const lastName = customer.lastName || '';
    
    return `${firstName} ${lastName}`.trim() || 'Unknown Customer';
  }

  const renderBookingsList = () => {
    if (isLoading) {
      return (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800">{error}</h3>
          <button 
            onClick={fetchBookings}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      )
    }

    if (filteredBookings.length === 0) {
      return (
        <div className="text-center py-12">
          <CalendarCheck size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="text-gray-500 mt-2">
            {statusFilter !== "all" 
              ? `You don't have any ${statusFilter.toLowerCase()} bookings.` 
              : "You don't have any bookings yet."}
          </p>
        </div>
      )
    }

    return (
      <div className="overflow-hidden">
        <div className="align-middle inline-block min-w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.providerService?.serviceName || "Unknown Service"}
                          </div>
                          <div className="text-sm text-gray-500">Booking #{booking.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{getCustomerFullName(booking.customer)}</div>
                      <div className="text-sm text-gray-500">{booking.customer?.email || "No email provided"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(booking.bookingDateTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-full transition-colors"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {booking.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => openResponseModal(booking, "CONFIRMED")}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-1.5 rounded-full transition-colors"
                              title="Accept booking"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => openResponseModal(booking, "CANCELLED")}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-colors"
                              title="Reject booking"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        
                        {booking.status === "CONFIRMED" && (
                          <button
                            onClick={() => openResponseModal(booking, "COMPLETED")}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-full transition-colors"
                            title="Mark as completed"
                          >
                            <CalendarCheck size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // The rest of your component code...

  return (
    <ServiceProviderLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
            <p className="text-gray-600 mt-1">Manage and respond to customer booking requests</p>
          </div>
          <button
            onClick={fetchBookings}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh Bookings
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by customer name, service, or booking ID..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div>
                  <label htmlFor="status-filter" className="sr-only">
                    Filter by status
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sort-by" className="sr-only">
                    Sort by
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="date-desc">Date (Newest First)</option>
                    <option value="date-asc">Date (Oldest First)</option>
                    <option value="created-desc">Created (Newest First)</option>
                    <option value="created-asc">Created (Oldest First)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings list */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {renderBookingsList()}
        </div>

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-40" onClick={closeBookingDetails}></div>
            <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-lg mx-4">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={closeBookingDetails}
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Booking Details</h3>
                <div className="mt-2 bg-blue-50 border border-blue-100 rounded-md p-4">
                  <h4 className="text-md font-medium text-blue-800">
                    {selectedBooking.providerService?.serviceName || 'Unknown Service'}
                  </h4>
                  <p className="text-sm text-blue-600 mt-1">
                    <span className="font-medium">Booking ID:</span> #{selectedBooking.id}
                  </p>
                  <div className="mt-2 flex items-center">
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Customer Information</h4>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>{getCustomerFullName(selectedBooking.customer)}</span>
                      </div>
                      {selectedBooking.customer?.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span>{selectedBooking.customer.email}</span>
                        </div>
                      )}
                      {selectedBooking.customer?.phoneNumber && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span>{selectedBooking.customer.phoneNumber}</span>
                        </div>
                      )}
                      {selectedBooking.customer?.address && (
                        <div className="flex items-start text-sm text-gray-500">
                          <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 mt-0.5" />
                          <span>{selectedBooking.customer.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Booking Details</h4>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>{formatDateTime(selectedBooking.bookingDateTime)}</span>
                      </div>
                      {selectedBooking.createdAt && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span>Booked on: {formatDateTime(selectedBooking.createdAt)}</span>
                        </div>
                      )}
                      {selectedBooking.providerService?.price && (
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <span>Service Price: Rs. {selectedBooking.providerService.price}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedBooking.bookingNotes && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900">Customer Notes</h4>
                    <div className="mt-2 bg-gray-50 rounded-md p-3 text-sm text-gray-500">
                      {selectedBooking.bookingNotes}
                    </div>
                  </div>
                )}

                {selectedBooking.status === "PENDING" && (
                  <div className="mt-6">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => openResponseModal(selectedBooking, "CONFIRMED")}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Accept Booking
                      </button>
                      <button
                        onClick={() => openResponseModal(selectedBooking, "CANCELLED")}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircle className="mr-2 h-5 w-5" />
                        Reject Booking
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedBooking.status === "CONFIRMED" && (
                  <div className="mt-6">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => openResponseModal(selectedBooking, "COMPLETED")}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <CalendarCheck className="mr-2 h-5 w-5" />
                        Mark as Completed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedBooking && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-40" onClick={closeResponseModal}></div>
            <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg mx-4">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={closeResponseModal}
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {responseType === "CONFIRMED" ? "Accept Booking" : responseType === "CANCELLED" ? "Reject Booking" : "Mark Booking as Complete"}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {responseType === "CONFIRMED"
                      ? "Are you sure you want to accept this booking? The customer will be notified of your decision."
                      : responseType === "CANCELLED"
                      ? "Are you sure you want to reject this booking? The customer will be notified of your decision."
                      : "Are you sure you want to mark this booking as complete?"}
                  </p>
                </div>

                <div className="mt-4">
                  <label htmlFor="response-comment" className="block text-sm font-medium text-gray-700">
                    Message to Customer (Optional)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="response-comment"
                      name="comment"
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder={
                        responseType === "CONFIRMED"
                          ? "Add any additional information for the customer..."
                          : responseType === "CANCELLED"
                          ? "Let the customer know why you're rejecting this booking..."
                          : "Add any additional information for the customer..."
                      }
                      value={responseComment}
                      onChange={(e) => setResponseComment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleStatusUpdate}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      responseType === "CONFIRMED"
                        ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                        : responseType === "COMPLETED"
                        ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : responseType === "CONFIRMED" ? (
                      <>
                        <CheckCircle size={16} className="mr-2" />
                        Accept
                      </>
                    ) : responseType === "CANCELLED" ? (
                      <>
                        <XCircle size={16} className="mr-2" />
                        Reject
                      </>
                    ) : (
                      <>
                        <CalendarCheck size={16} className="mr-2" />
                        Complete
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeResponseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ServiceProviderLayout>
  )
}

export default BookingManagement