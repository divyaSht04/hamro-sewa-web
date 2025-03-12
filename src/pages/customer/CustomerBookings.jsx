"use client"

import { useState, useEffect } from "react"
import { FaCalendarAlt, FaSearch, FaFilter, FaEye, FaTimes } from "react-icons/fa"
import { useAuth } from "../../auth/AuthContext"
import { getCustomerBookings, cancelBooking } from "../../services/bookingService"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { toast } from "react-hot-toast"
import ErrorDisplay from "../../components/auth/ErrorDisplay"

const CustomerBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const data = await getCustomerBookings(user.id)
        setBookings(data)
        setFilteredBookings(data)
      } catch (err) {
        setError(err.message || "Failed to load bookings")
        toast.error("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, statusFilter, dateFilter, bookings])

  const applyFilters = () => {
    let result = [...bookings]

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.status.toLowerCase() === statusFilter)
    }

    // Apply date filter
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    const nextMonth = new Date(today)
    nextMonth.setDate(today.getDate() + 30)

    if (dateFilter === "upcoming") {
      result = result.filter((booking) => new Date(booking.date) >= today)
    } else if (dateFilter === "past") {
      result = result.filter((booking) => new Date(booking.date) < today)
    } else if (dateFilter === "next7days") {
      result = result.filter((booking) => {
        const bookingDate = new Date(booking.date)
        return bookingDate >= today && bookingDate <= nextWeek
      })
    } else if (dateFilter === "next30days") {
      result = result.filter((booking) => {
        const bookingDate = new Date(booking.date)
        return bookingDate >= today && bookingDate <= nextMonth
      })
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (booking) =>
          booking.service.name.toLowerCase().includes(term) ||
          booking.service.provider.name.toLowerCase().includes(term),
      )
    }

    setFilteredBookings(result)
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking)
    setShowCancelModal(true)
  }

  const confirmCancelBooking = async () => {
    try {
      setLoading(true)
      await cancelBooking(selectedBooking.id, { reason: cancelReason })

      // Update local state
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id ? { ...booking, status: "cancelled", cancelReason } : booking,
      )

      setBookings(updatedBookings)
      setShowCancelModal(false)
      setCancelReason("")
      toast.success("Booking cancelled successfully")
    } catch (err) {
      setError(err.message || "Failed to cancel booking")
      toast.error("Failed to cancel booking")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading && bookings.length === 0) {
    return <LoadingSpinner />
  }

  if (error && bookings.length === 0) {
    return <ErrorDisplay message={error} />
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex items-center">
          <FaFilter className="mr-2 text-gray-500" />
          <span className="text-gray-700 mr-2">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-500" />
          <span className="text-gray-700 mr-2">Date:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="next7days">Next 7 Days</option>
            <option value="next30days">Next 30 Days</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-8">
          <FaCalendarAlt className="mx-auto text-gray-300 text-5xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {bookings.length === 0 ? "You haven't made any bookings yet." : "No bookings match your current filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{booking.service.name}</div>
                    <div className="text-sm text-gray-500">{booking.service.category}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{booking.service.provider.name}</div>
                    <div className="text-sm text-gray-500">{booking.service.provider.phone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="text-red-600 hover:text-red-800"
                          title="Cancel Booking"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-xl font-bold">Booking Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-white hover:text-gray-200">
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Service Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Service Name</p>
                      <p className="font-medium">{selectedBooking.service.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{selectedBooking.service.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">${selectedBooking.service.price}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Provider Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Provider Name</p>
                      <p className="font-medium">{selectedBooking.service.provider.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{selectedBooking.service.provider.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedBooking.service.provider.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Booking Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{selectedBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedBooking.status)}`}
                    >
                      {selectedBooking.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-medium">{selectedBooking.id}</p>
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Additional Notes</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{selectedBooking.notes}</p>
                </div>
              )}

              {selectedBooking.status === "cancelled" && selectedBooking.cancelReason && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Cancellation Reason</h4>
                  <p className="text-gray-600 bg-red-50 p-3 rounded-md">{selectedBooking.cancelReason}</p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-xl font-bold">Cancel Booking</h3>
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason("")
                }}
                className="text-white hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-700">
                Are you sure you want to cancel your booking for{" "}
                <span className="font-semibold">{selectedBooking.service.name}</span> on{" "}
                <span className="font-semibold">{new Date(selectedBooking.date).toLocaleDateString()}</span> at{" "}
                <span className="font-semibold">{selectedBooking.time}</span>?
              </p>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Reason for cancellation (optional)</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Please provide a reason for cancellation..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelReason("")
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
                >
                  No, Keep Booking
                </button>
                <button
                  onClick={confirmCancelBooking}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                  disabled={loading}
                >
                  {loading ? "Cancelling..." : "Yes, Cancel Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerBookings