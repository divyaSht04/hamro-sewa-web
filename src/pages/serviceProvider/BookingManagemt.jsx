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
    if (!selectedBooking || !responseType) return;
    
    setIsSubmitting(true);
    
    try {
      let success = false;
      
      // Check if this is a loyalty discounted booking being cancelled
      const isLoyaltyDiscountRejection = responseType === 'CANCELLED' && selectedBooking.discountApplied;
      
      if (responseType === 'CANCELLED') {
        success = await cancelBooking(
          selectedBooking.id,
          responseComment,
          isLoyaltyDiscountRejection
        );
      } else {
        success = await updateBookingStatus(
          selectedBooking.id,
          responseType,
          responseComment
        );
      }
      
      if (success) {
        toast.success(`Booking ${responseType.toLowerCase()} successfully`);
        if (isLoyaltyDiscountRejection) {
          toast.info('Customer can still use their loyalty discount on another service from you');
        }
        closeResponseModal();
        await fetchBookings(); // Refresh the bookings list
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data || 
                         "Failed to update booking status. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderResponseModal = () => {
    if (!showResponseModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {responseType === 'CANCELLED' ? 'Reject Booking' : 
               responseType === 'CONFIRMED' ? 'Confirm Booking' : 
               'Complete Booking'}
            </h3>
            <button
              onClick={closeResponseModal}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a comment (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              value={responseComment}
              onChange={(e) => setResponseComment(e.target.value)}
              placeholder={responseType === 'CANCELLED' ? 
                "Explain why you're rejecting this booking..." : 
                "Add any additional notes..."}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={closeResponseModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                responseType === 'CANCELLED'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : responseType === 'CANCELLED' ? (
                'Reject Booking'
              ) : responseType === 'CONFIRMED' ? (
                'Confirm Booking'
              ) : (
                'Complete Booking'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "No date provided";
    
    try {
      // Use our utility function to properly parse array or string dates
      const dateObj = parseDate(dateTimeStr);
      return format(dateObj, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
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
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800">{error}</h3>
          <button 
            onClick={fetchBookings}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
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
      );
    }

    return (
      <div className="overflow-hidden">
        <div className="align-middle inline-block min-w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {booking?.discountApplied ? (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="line-through text-gray-400 mr-1">Rs. {booking.originalPrice?.toFixed(2)}</span>
                            <span className="text-green-600 font-medium">Rs. {booking.discountedPrice?.toFixed(2)}</span>
                          </div>
                          <div className="text-xs mt-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block w-fit">
                            Loyalty discount applied
                          </div>
                        </div>
                      ) : (
                        <div>
                          Rs. {booking.originalPrice?.toFixed(2) || booking.providerService?.price?.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                      {booking.statusComment && (
                        <div className="text-xs text-gray-500 mt-1">
                          {booking.statusComment}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {booking.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => openResponseModal(booking, "CONFIRMED")}
                              className="text-green-600 hover:text-green-900"
                              title="Confirm Booking"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => openResponseModal(booking, "CANCELLED")}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Booking"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {booking.status === "CONFIRMED" && (
                          <button
                            onClick={() => openResponseModal(booking, "COMPLETED")}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Completed"
                          >
                            <CalendarCheck size={18} />
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
    );
  };

  return (
    <ServiceProviderLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Booking Management</h1>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                placeholder="Search bookings..."
                className="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                className="form-select py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 border-gray-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
            <div className="relative">
              <select
                className="form-select py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 border-gray-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="created-desc">Recently Created</option>
                <option value="created-asc">Oldest Created</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {renderBookingsList()}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && !showResponseModal && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      Booking Details
                    </h3>
                    <button
                      onClick={closeBookingDetails}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Service</span>
                      <span className="text-sm font-medium">
                        {selectedBooking.providerService?.serviceName || "Unknown Service"}
                      </span>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Price</span>
                      <span className="text-sm font-medium">
                        {selectedBooking?.discountApplied ? (
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <span className="line-through text-gray-400 mr-1">Rs. {selectedBooking.originalPrice?.toFixed(2)}</span>
                              <span className="text-green-600 font-medium">Rs. {selectedBooking.discountedPrice?.toFixed(2)}</span>
                            </div>
                            <div className="text-xs mt-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block w-fit">
                              Loyalty discount applied
                            </div>
                          </div>
                        ) : (
                          <div>
                            Rs. {selectedBooking.originalPrice?.toFixed(2) || selectedBooking.providerService?.price?.toFixed(2)}
                          </div>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className="text-sm font-medium">
                        {getStatusBadge(selectedBooking.status)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Customer</span>
                      <span className="text-sm font-medium">
                        {getCustomerFullName(selectedBooking.customer)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Contact Information</span>
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-1 text-gray-400" />
                        <span>{selectedBooking.customer?.email || "No email provided"}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={14} className="mr-1 text-gray-400" />
                        <span>{selectedBooking.customer?.phone || "No phone provided"}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Booking Date & Time</span>
                      <div className="flex items-center text-sm">
                        <Calendar size={14} className="mr-1 text-gray-400" />
                        <span>{formatDateTime(selectedBooking.bookingDateTime)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Notes</span>
                      <p className="text-sm">
                        {selectedBooking.customerNotes || "No notes provided"}
                      </p>
                    </div>
                    
                    {selectedBooking.providerResponse && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-500">Provider Response</span>
                        <p className="text-sm">
                          {selectedBooking.providerResponse}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {selectedBooking.status === "PENDING" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          closeBookingDetails()
                          openResponseModal(selectedBooking, "CONFIRMED")
                        }}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          closeBookingDetails()
                          openResponseModal(selectedBooking, "CANCELLED")
                        }}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Reject
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
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {renderResponseModal()}
      </div>
    </ServiceProviderLayout>
  )
}

export default BookingManagement;
