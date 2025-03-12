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

// Mock data for bookings
const mockBookings = [
  {
    id: "BK1001",
    serviceName: "Home Cleaning",
    customerName: "John Smith",
    customerEmail: "john.smith@example.com",
    customerPhone: "+1 (555) 123-4567",
    date: "2025-03-15",
    time: "10:00 AM",
    address: "123 Main Street",
    city: "Springfield",
    zipCode: "12345",
    instructions: "Please bring eco-friendly cleaning supplies.",
    status: "pending",
    price: "$100.00",
    serviceFee: "$10.00",
    totalAmount: "$110.00",
    createdAt: "2025-03-10T14:30:00Z",
  },
  {
    id: "BK1002",
    serviceName: "Plumbing Repair",
    customerName: "Emily Johnson",
    customerEmail: "emily.j@example.com",
    customerPhone: "+1 (555) 987-6543",
    date: "2025-03-16",
    time: "02:00 PM",
    address: "456 Oak Avenue",
    city: "Springfield",
    zipCode: "12345",
    instructions: "The kitchen sink is leaking.",
    status: "pending",
    price: "$150.00",
    serviceFee: "$10.00",
    totalAmount: "$160.00",
    createdAt: "2025-03-11T09:15:00Z",
  },
  {
    id: "BK1003",
    serviceName: "Electrical Work",
    customerName: "Michael Brown",
    customerEmail: "michael.b@example.com",
    customerPhone: "+1 (555) 456-7890",
    date: "2025-03-17",
    time: "09:00 AM",
    address: "789 Pine Street",
    city: "Springfield",
    zipCode: "12345",
    instructions: "Need to install new light fixtures in the living room.",
    status: "accepted",
    price: "$200.00",
    serviceFee: "$10.00",
    totalAmount: "$210.00",
    createdAt: "2025-03-12T11:45:00Z",
    responseDate: "2025-03-12T14:20:00Z",
    responseComment: "Looking forward to helping you with your electrical needs.",
  },
  {
    id: "BK1004",
    serviceName: "Gardening",
    customerName: "Sarah Wilson",
    customerEmail: "sarah.w@example.com",
    customerPhone: "+1 (555) 789-0123",
    date: "2025-03-18",
    time: "01:00 PM",
    address: "321 Maple Drive",
    city: "Springfield",
    zipCode: "12345",
    instructions: "Please focus on the front yard landscaping.",
    status: "rejected",
    price: "$80.00",
    serviceFee: "$10.00",
    totalAmount: "$90.00",
    createdAt: "2025-03-13T10:30:00Z",
    responseDate: "2025-03-13T16:45:00Z",
    responseComment: "Unfortunately, we are fully booked on this date. Please try booking for a different date.",
  },
  {
    id: "BK1005",
    serviceName: "Interior Painting",
    customerName: "David Lee",
    customerEmail: "david.l@example.com",
    customerPhone: "+1 (555) 234-5678",
    date: "2025-03-20",
    time: "10:00 AM",
    address: "567 Elm Street",
    city: "Springfield",
    zipCode: "12345",
    instructions: "Need to paint the master bedroom. The paint is already purchased.",
    status: "pending",
    price: "$250.00",
    serviceFee: "$10.00",
    totalAmount: "$260.00",
    createdAt: "2025-03-14T13:20:00Z",
  },
]

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
  const [responseType, setResponseType] = useState(null) // 'accept' or 'reject'
  const [responseComment, setResponseComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch bookings
    setIsLoading(true)
    setTimeout(() => {
      setBookings(mockBookings)
      setFilteredBookings(mockBookings)
      setIsLoading(false)
    }, 800)
  }, [])

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
          booking.customerName.toLowerCase().includes(searchLower) ||
          booking.serviceName.toLowerCase().includes(searchLower) ||
          booking.id.toLowerCase().includes(searchLower),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.date) - new Date(b.date)
        case "date-desc":
          return new Date(b.date) - new Date(a.date)
        case "created-asc":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "created-desc":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "price-asc":
          return Number.parseFloat(a.totalAmount.replace("$", "")) - Number.parseFloat(b.totalAmount.replace("$", ""))
        case "price-desc":
          return Number.parseFloat(b.totalAmount.replace("$", "")) - Number.parseFloat(a.totalAmount.replace("$", ""))
        default:
          return new Date(b.date) - new Date(a.date)
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

  const handleResponseClick = (type) => {
    setResponseType(type)
    setResponseComment("")
    setShowResponseModal(true)
  }

  const handleResponseSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const updatedBookings = bookings.map((booking) => {
        if (booking.id === selectedBooking.id) {
          return {
            ...booking,
            status: responseType === "accept" ? "accepted" : "rejected",
            responseDate: new Date().toISOString(),
            responseComment: responseComment,
          }
        }
        return booking
      })

      setBookings(updatedBookings)
      setSelectedBooking({
        ...selectedBooking,
        status: responseType === "accept" ? "accepted" : "rejected",
        responseDate: new Date().toISOString(),
        responseComment: responseComment,
      })

      setShowResponseModal(false)
      setIsSubmitting(false)

      toast.success(responseType === "accept" ? "Booking accepted successfully!" : "Booking rejected successfully!")
    }, 1000)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        )
      case "accepted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle size={12} className="mr-1" />
            Accepted
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle size={12} className="mr-1" />
            Rejected
          </span>
        )
      default:
        return null
    }
  }

  return (
    <ServiceProviderLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
            <p className="text-gray-600 mt-1">View and manage your service bookings</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Filters and Search */}
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by customer name, service, or booking ID..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <select
                      className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>

                  <div className="relative">
                    <select
                      className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 bg-white"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date-desc">Sort by: Latest Service Date</option>
                      <option value="date-asc">Sort by: Earliest Service Date</option>
                      <option value="created-desc">Sort by: Recently Created</option>
                      <option value="created-asc">Sort by: Oldest Created</option>
                      <option value="price-desc">Sort by: Highest Price</option>
                      <option value="price-asc">Sort by: Lowest Price</option>
                    </select>
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
            </div>
          ) : (
            <>
              {filteredBookings.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">No bookings found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CalendarCheck className="w-6 h-6 text-green-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{booking.serviceName}</h3>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(booking.status)}
                              <span className="text-sm text-gray-500">{booking.id}</span>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <User size={14} className="mr-1" />
                              {booking.customerName}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(booking.date)}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock size={14} className="mr-1" />
                              {booking.time}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <DollarSign size={14} className="mr-1" />
                              {booking.totalAmount}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                          <button
                            onClick={() => handleViewBooking(booking)}
                            className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <Eye size={16} className="mr-1.5" />
                            View Details
                          </button>

                          {booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking)
                                  handleResponseClick("accept")
                                }}
                                className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              >
                                <CheckCircle size={16} className="mr-1.5" />
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking)
                                  handleResponseClick("reject")
                                }}
                                className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <XCircle size={16} className="mr-1.5" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-auto overflow-hidden relative"
          >
            <div className="relative h-16 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <CalendarCheck className="w-6 h-6 mr-2" />
                Booking Details
              </h2>
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={closeBookingDetails}
                  className="p-2 bg-white bg-opacity-20 backdrop-blur-md rounded-full hover:bg-opacity-30 transition-colors text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedBooking.serviceName}</h3>
                  <p className="text-gray-600">Booking ID: {selectedBooking.id}</p>
                </div>
                <div>{getStatusBadge(selectedBooking.status)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Customer Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">{selectedBooking.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{selectedBooking.customerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{selectedBooking.customerPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">{formatDate(selectedBooking.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium text-gray-900">{selectedBooking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-medium text-gray-900">{selectedBooking.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Location</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.address}, {selectedBooking.city}, {selectedBooking.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.instructions && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Special Instructions
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <p className="text-gray-700">{selectedBooking.instructions}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedBooking.status !== "pending" && selectedBooking.responseComment && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Response</h4>
                  <div
                    className={`p-4 rounded-lg ${
                      selectedBooking.status === "accepted"
                        ? "bg-green-50 border border-green-100"
                        : "bg-red-50 border border-red-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {selectedBooking.status === "accepted" ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={`font-medium ${
                            selectedBooking.status === "accepted" ? "text-green-800" : "text-red-800"
                          } mb-1`}
                        >
                          {selectedBooking.status === "accepted" ? "Accepted" : "Rejected"} on{" "}
                          {formatDate(selectedBooking.responseDate)}
                        </p>
                        <p className="text-gray-700">{selectedBooking.responseComment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={closeBookingDetails}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>

                {selectedBooking.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleResponseClick("accept")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={16} className="inline mr-2" />
                      Accept Booking
                    </button>
                    <button
                      onClick={() => handleResponseClick("reject")}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle size={16} className="inline mr-2" />
                      Reject Booking
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {responseType === "accept" ? "Accept Booking" : "Reject Booking"}
            </h3>

            <div
              className={`p-4 rounded-lg mb-4 ${
                responseType === "accept" ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"
              }`}
            >
              <div className="flex items-start gap-3">
                {responseType === "accept" ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                )}
                <p className="text-gray-700">
                  {responseType === "accept"
                    ? "You are about to accept this booking. The customer will be notified of your decision."
                    : "You are about to reject this booking. Please provide a reason for the rejection."}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                {responseType === "accept" ? "Message to Customer (Optional)" : "Reason for Rejection"}
              </label>
              <textarea
                value={responseComment}
                onChange={(e) => setResponseComment(e.target.value)}
                placeholder={
                  responseType === "accept"
                    ? "Add any additional information for the customer..."
                    : "Please explain why you're rejecting this booking..."
                }
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required={responseType === "reject"}
              ></textarea>
              {responseType === "reject" && !responseComment && (
                <p className="mt-1 text-sm text-red-600">Please provide a reason for rejection</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResponseSubmit}
                disabled={(responseType === "reject" && !responseComment) || isSubmitting}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  responseType === "accept" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>{responseType === "accept" ? "Accept Booking" : "Reject Booking"}</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </ServiceProviderLayout>
  )
}