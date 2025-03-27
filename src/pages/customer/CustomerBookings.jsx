"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Search,
  Filter,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import { getCustomerBookings, cancelBooking } from "../../services/bookingService"

export default function CustomerBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const data = await getCustomerBookings(user.id)
      setBookings(data)
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError("Failed to load your bookings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      setCancellingId(bookingId)
      await cancelBooking(bookingId)

      // Update the local state
      setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "CANCELLED" } : booking)))
    } catch (err) {
      console.error("Error cancelling booking:", err)
      alert("Failed to cancel booking. Please try again.")
    } finally {
      setCancellingId(null)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    // Filter by status
    if (filterStatus !== "all" && booking.status !== filterStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        booking.service?.serviceName?.toLowerCase().includes(query) ||
        booking.provider?.name?.toLowerCase().includes(query) ||
        booking.location?.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.bookingDate) - new Date(b.bookingDate)
      case "date-desc":
        return new Date(b.bookingDate) - new Date(a.bookingDate)
      case "price-asc":
        return (a.service?.price || 0) - (b.service?.price || 0)
      case "price-desc":
        return (b.service?.price || 0) - (a.service?.price || 0)
      case "name-asc":
        return (a.service?.serviceName || "").localeCompare(b.service?.serviceName || "")
      case "name-desc":
        return (b.service?.serviceName || "").localeCompare(a.service?.serviceName || "")
      default:
        return new Date(b.bookingDate) - new Date(a.bookingDate)
    }
  })

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle size={12} className="mr-1" />
            Pending
          </span>
        )
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Confirmed
          </span>
        )
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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


  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-red-500 mb-4">
              <AlertTriangle size={48} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Bookings</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchBookings}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 sm:px-8 sm:py-6">
            <h1 className="text-2xl font-bold text-white">My Bookings</h1>
            <p className="text-purple-100 mt-1">Manage all your service bookings in one place</p>
          </div>

          {/* Filters and Search */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookings..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>

              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Filter size={16} className="mr-2 text-gray-500" />
                Filters
                <ChevronDown
                  size={16}
                  className={`ml-2 transition-transform duration-200 ${isFiltersOpen ? "transform rotate-180" : ""}`}
                />
              </button>
            </div>

            {isFiltersOpen && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="filter-status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                  >
                    <option value="date-desc">Date (Newest First)</option>
                    <option value="date-asc">Date (Oldest First)</option>
                    <option value="name-asc">Service Name (A-Z)</option>
                    <option value="name-desc">Service Name (Z-A)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="price-asc">Price (Low to High)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Bookings List */}
          <div className="divide-y divide-gray-200">
            {sortedBookings.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery || filterStatus !== "all"
                    ? "Try changing your search or filter criteria"
                    : "You haven't made any bookings yet"}
                </p>
                <div className="mt-6">
                  <Link
                    to="/services"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Browse Services
                  </Link>
                </div>
              </div>
            ) : (
              sortedBookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 rounded-md bg-purple-100 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {booking.service?.serviceName || "Unnamed Service"}
                          </h3>
                          <div className="mt-1 flex items-center">
                            {getStatusBadge(booking.status)}
                            <span className="ml-2 text-sm text-gray-500">Booking ID: #{booking.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{formatDate(booking.bookingDate)}</span>
                        </div>

                        {booking.provider && (
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{booking.provider.name}</span>
                          </div>
                        )}

                        {booking.location && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{booking.location}</span>
                          </div>
                        )}

                        {booking.service?.price && (
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="font-medium text-gray-900">Rs. {booking.service.price.toFixed(2)}</span>
                            {booking.service.priceUnit && <span className="ml-1">per {booking.service.priceUnit}</span>}
                          </div>
                        )}
                      </div>

                      {booking.notes && (
                        <div className="mt-3 flex items-start text-sm text-gray-500">
                          <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 mt-0.5" />
                          <span>{booking.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Link
                        to={`/service-details/${booking.service?.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        View Service
                      </Link>

                      {booking.status === "PENDING" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          {cancellingId === booking.id ? (
                            <>
                              <div className="animate-spin mr-1.5 h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full"></div>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <Trash2 size={14} className="mr-1.5" />
                              Cancel
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}