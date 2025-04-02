"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {ArrowLeft,Star,Clock,DollarSign,Calendar,MapPin,Phone, Mail, Globe,Check, AlertCircle, FileText, Download, Info, ChevronRight, Heart, Share2,MessageCircle,Edit2,Trash2,X,} from "lucide-react"
import { getServiceById, getServiceImageUrl, getServicePdfUrl } from "../../services/providerServiceApi"
import { getServiceReviews, getServiceAverageRating, createReview, updateReview, deleteReview } from "../../services/reviewService"
import { createBooking, getServiceBookings } from "../../services/bookingService"
import { useAuth } from "../../auth/AuthContext"
import toast from "react-hot-toast"

export default function ServiceDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Service-related state
  const [service, setService] = useState(null)
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isFavorite, setIsFavorite] = useState(false)

  // Review-related state
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(null)
  const [userReview, setUserReview] = useState("")
  const [userRating, setUserRating] = useState(5)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [filterRating, setFilterRating] = useState(null)
  const [sortByRecent, setSortByRecent] = useState(true)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [completedBookings, setCompletedBookings] = useState([])
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [isEditingReview, setIsEditingReview] = useState(false)
  const [reviewToEditId, setReviewToEditId] = useState(null)
  const [isDeletingReview, setIsDeletingReview] = useState(false)

  // Booking-related state
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingNotes, setBookingNotes] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true)
        // Fetch service details
        const serviceData = await getServiceById(Number.parseInt(id))
        console.log("Service data:", serviceData)
        console.log("Image path:", serviceData.imagePath)
        setService(serviceData)

        // Fetch provider details if available
        if (serviceData.serviceProvider) {
          setProvider(serviceData.serviceProvider)
        }

        // Fetch reviews for this service
        try {
          const serviceReviews = await getServiceReviews(id)
          // Process reviews to ensure customer data is available
          const processedReviews = serviceReviews.map(review => {
            // Extract customer name from customer object or use customerId
            const customerName = review.customer?.name || review.customer?.username || 
                                 (review.customerId ? `Customer ${review.customerId}` : "Customer")
            
            return {
              ...review,
              customerName: customerName,
              // Set a default value for customerImage if none exists
              customerImage: review.customer?.profileImage || null
            }
          })
          setReviews(processedReviews || [])
          console.log("Processed reviews:", processedReviews)
        } catch (reviewErr) {
          console.error("Error fetching reviews:", reviewErr)
          setReviews([])
        }
        try {
          const rating = await getServiceAverageRating(id)
          setAverageRating(typeof rating === "number" ? rating : null)
        } catch (ratingErr) {
          console.error("Error fetching rating:", ratingErr)
          setAverageRating(null)
        }
        if (user) {
          await fetchUserCompletedBookings(id, user.id)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching service details:", err)
        setError("Unable to load service details. The server may be down or the service might not exist.")
        setLoading(false)
      }
    }

    fetchServiceData()
  }, [id, user])
  const fetchUserCompletedBookings = async (serviceId, userId) => {
    try {
      // Get user's bookings for this service
      const bookings = await getServiceBookings(serviceId)

      // Filter for completed bookings by this user
      const userCompletedBookings = bookings.filter(
        booking => booking.customerId === userId && booking.status === "COMPLETED"
      )
      
      setCompletedBookings(userCompletedBookings)
      
      // Check if any of these bookings haven't been reviewed yet
      const reviewedBookingIds = reviews
        .filter(review => review.customerId === userId)
        .map(review => review.bookingId)
      
      const hasUnreviewedBooking = userCompletedBookings.some(
        booking => !reviewedBookingIds.includes(booking.id)
      )
      
      setCanReview(hasUnreviewedBooking)
      
      // Set the first unreviewed booking as the selected one
      if (hasUnreviewedBooking) {
        const firstUnreviewedBooking = userCompletedBookings.find(
          booking => !reviewedBookingIds.includes(booking.id)
        )
        setSelectedBookingId(firstUnreviewedBooking?.id)
      }
    } catch (err) {
      console.error("Error checking completed bookings:", err)
      setCompletedBookings([])
      setCanReview(false)
    }
  }

  // Handle submitting a real review
  const handleSubmitReview = async () => {
    if (userReview.trim() === "" || !user) return
    // Only check for selectedBookingId if creating a new review, not when editing
    if (!isEditingReview && !selectedBookingId) {
      toast.error("Please select a booking to review");
      return;
    }

    setReviewLoading(true)

    try {
      const reviewData = {
        rating: userRating,
        comment: userReview,
        customerId: user.id,
        providerServiceId: Number.parseInt(id),
        bookingId: selectedBookingId
      }

      console.log("Submitting review data:", reviewData, "isEditing:", isEditingReview, "reviewId:", reviewToEditId);

      let updatedReview;
      
      if (isEditingReview && reviewToEditId) {
        // Update existing review
        updatedReview = await updateReview(reviewToEditId, reviewData);
        console.log("Review updated successfully:", updatedReview);
        
        // Update reviews list with the edited review
        setReviews(reviews.map(review => {
          if (review.id === reviewToEditId) {
            // Preserve the customer name and image in the updated review
            return {
              ...updatedReview,
              customerName: review.customerName || "Customer",
              customerImage: review.customerImage
            };
          }
          return review;
        }));
        
        toast.success("Review updated successfully");
      } else {
        // Submit review to backend
        updatedReview = await createReview(reviewData)

        // Update reviews list with the new review
        setReviews([updatedReview, ...reviews])
        
        toast.success("Review submitted successfully");
      }

      // Update average rating
      const updatedRating = await getServiceAverageRating(id)
      setAverageRating(updatedRating)

      // Update completed bookings list if it was a new review
      if (!isEditingReview) {
        const updatedBookings = completedBookings.filter(booking => booking.id !== selectedBookingId)
        setCompletedBookings(updatedBookings)
        
        // Check if user has more bookings to review
        if (updatedBookings.length > 0) {
          setSelectedBookingId(updatedBookings[0].id)
        } else {
          setCanReview(false)
          setSelectedBookingId(null)
        }
      }

      // Reset form
      setUserReview("")
      setUserRating(5)
      setShowReviewForm(false)
      setIsEditingReview(false)
      setReviewToEditId(null)
    } catch (err) {
      console.error("Error submitting review:", err)
      // Show error message to user
      toast.error(err.response?.data || "Failed to submit review. Please try again.")
    } finally {
      setReviewLoading(false)
    }
  }
  
  // Edit an existing review
  const handleEditReview = (review) => {
    if (!user) return
    
    console.log("Editing review:", review);
    
    // Make sure we have the basics needed to edit
    if (!review || !review.id) {
      toast.error("Cannot edit this review. Missing required data.");
      return;
    }
    
    setIsEditingReview(true);
    setReviewToEditId(review.id);
    setUserRating(review.rating);
    setUserReview(review.comment);
    
    // Handle different ways the booking ID might be stored
    if (review.booking && review.booking.id) {
      setSelectedBookingId(review.booking.id);
    } else if (review.bookingId) {
      setSelectedBookingId(review.bookingId);
    }
    
    // Always show the form after setting up the data
    setShowReviewForm(true);
  }
  
  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    if (!user || !reviewId) return
    
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return
    }
    
    setIsDeletingReview(true)
    
    try {
      await deleteReview(reviewId, user.id)
      
      // Remove the review from the list
      setReviews(reviews.filter(review => review.id !== reviewId))
      
      // Update average rating
      const updatedRating = await getServiceAverageRating(id)
      setAverageRating(updatedRating)
      
      // Re-check if user can review again
      if (user) {
        await fetchUserCompletedBookings(id, user.id)
      }
      
      toast.success("Review deleted successfully")
    } catch (err) {
      console.error("Error deleting review:", err)
      toast.error("Failed to delete review. Please try again.")
    } finally {
      setIsDeletingReview(false)
    }
  }

  // Handle booking creation
  const handleBookService = async (e) => {
    e.preventDefault()

    if (!user || !bookingDate || !bookingTime) {
      setBookingError("Please select a date and time for your booking")
      return
    }

    setBookingLoading(true)
    setBookingError(null)

    try {
      const bookingData = {
        customerId: user.id,
        providerServiceId: Number.parseInt(id),
        bookingDate: `${bookingDate}T${bookingTime}:00`, // Format as ISO date time
        notes: bookingNotes,
        // Status will be set to PENDING by default in the backend
      }

      console.log("Submitting booking data:", bookingData)

      // Submit booking to backend
      const response = await createBooking(bookingData)
      console.log("Booking created successfully:", response)

      // Show success message
      setBookingSuccess(true)
      
      // Reset form fields
      setBookingDate("")
      setBookingTime("")
      setBookingNotes("")

      // Redirect to bookings page after a short delay
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

  const handleFilterByRating = () => {
    if (filterRating === null) {
      setFilterRating(5) // Start with 5 stars
    } else if (filterRating === 1) {
      setFilterRating(null) // Reset filter
    } else {
      setFilterRating(filterRating - 1) // Decrease rating
    }
  }

  const handleSortByRecent = () => {
    setSortByRecent(!sortByRecent)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Here you would typically call an API to save the favorite status
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.serviceName,
        text: `Check out this service: ${service.serviceName}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const filteredAndSortedReviews = [...reviews]
    .filter((review) => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      if (sortByRecent) {
        return new Date(b.date) - new Date(a.date)
      }
      return 0
    })

  const handleBack = () => {
    navigate("/services")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading service details...</p>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Unavailable</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Services
        </button>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
        <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Services
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button - fixed position with higher z-index */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={22} className="text-gray-700" />
      </button>

      {/* Hero section with service image */}
      <div className="relative w-full h-[450px] md:h-[500px] bg-gray-200 overflow-hidden animate-fadeIn">
        {!service.id && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        )}
        {service.id && (
          <img
            src={
              service.imagePath
                ? getServiceImageUrl(service.id)
                : "https://images.unsplash.com/photo-1581578731548-c64695cc6952"
            }
            alt={service.serviceName || "Service image"}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={toggleFavorite}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            aria-label="Share service"
          >
            <Share2 size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white container mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {service.category && (
              <span className="text-xs uppercase tracking-wide bg-purple-600 px-3 py-1 rounded-full font-medium">
                {service.category}
              </span>
            )}
            <div className="flex items-center bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${i < Math.round(averageRating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                    }`}
                />
              ))}
              {averageRating ? (
                <span className="ml-1 text-sm">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              ) : (
                <span className="ml-1 text-sm">New Service</span>
              )}
            </div>
            {service.status && (
              <span
                className={`text-xs uppercase px-3 py-1 rounded-full font-medium ${service.status === "APPROVED"
                    ? "bg-green-600"
                    : service.status === "PENDING"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
              >
                {service.status}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white">{service.serviceName}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {provider && (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm mr-2">
                  {provider.name?.charAt(0).toUpperCase() || "P"}
                </div>
                <p className="text-white/90">
                  Provided by <span className="font-medium">{provider.name}</span>
                </p>
              </div>
            )}
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-white/80 mr-1" />
              <p className="text-white/90 font-medium">Rs. {service.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-white/80 mr-1" />
              <p className="text-white/90">{service.location || provider?.location || "Kathmandu, Nepal"}</p>
            </div>
          </div>

          {/* Quick action button */}
          {user && service.status === "APPROVED" && (
            <button
              onClick={() => {
                console.log("Navigating to booking page with ID:", service.id)
                navigate(`/booking/${service.id}`)
              }}
              className="mt-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] inline-flex items-center animate-fadeIn"
            >
              Book Now
              <ChevronRight size={18} className="ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-slideUp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Service details */}
          <div className="md:col-span-2 space-y-8">
            {/* Tabs navigation */}
            <div className="bg-white rounded-t-lg shadow-sm">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-6 font-medium text-sm flex-1 ${activeTab === "overview"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-4 px-6 font-medium text-sm flex-1 ${activeTab === "reviews"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                >
                  Reviews ({reviews.length})
                </button>
                {service.pdfPath && (
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`py-4 px-6 font-medium text-sm flex-1 ${activeTab === "documents"
                        ? "border-b-2 border-purple-600 text-purple-600"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                  >
                    Documents
                  </button>
                )}
              </nav>
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-lg shadow-sm p-6 -mt-8 pt-8 animate-fadeIn">
              {/* Overview tab */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="text-2xl font-bold">About this service</h2>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{service.description}</p>

                  {/* Service details summary */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg flex items-start space-x-3 hover:shadow-md hover:translate-y-[-2px] transition-all duration-300">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Clock className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Duration</h3>
                        <p className="text-gray-600">
                          {service.durationHours ? `${service.durationHours} hours` : "Varies based on requirements"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg flex items-start space-x-3 hover:shadow-md hover:translate-y-[-2px] transition-all duration-300">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <DollarSign className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Price</h3>
                        <p className="text-gray-600">Rs. {service.price}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg flex items-start space-x-3 hover:shadow-md hover:translate-y-[-2px] transition-all duration-300">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <MapPin className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Location</h3>
                        <p className="text-gray-600">{service.location || provider?.location || "Kathmandu, Nepal"}</p>
                      </div>
                    </div>
                    {service.createdAt && (
                      <div className="bg-gray-50 p-4 rounded-lg flex items-start space-x-3 hover:shadow-md hover:translate-y-[-2px] transition-all duration-300">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Calendar className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Listed On</h3>
                          <p className="text-gray-600">{new Date(service.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Service status */}
                  {service.status && (
                    <div className="bg-gray-50 p-5 rounded-lg mt-6 border-l-4 border-blue-500">
                      <div className="flex items-center space-x-2">
                        <Info size={20} className="text-blue-500" />
                        <span className="font-medium">Service Status:</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${service.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : service.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {service.status}
                        </span>
                      </div>
                      {service.status === "REJECTED" && service.feedback && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Feedback:</span> {service.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Reviews tab */}
              {activeTab === "reviews" && (
                <div className="animate-fadeIn">
                  {/* Review statistics */}
                  {reviews.length > 0 ? (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                      <div className="flex flex-wrap items-stretch gap-6 mb-6">
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl text-center min-w-[180px] border border-purple-100">
                          <div className="text-5xl font-bold text-gray-900 mb-1">
                            {averageRating?.toFixed(1) || "0"}
                          </div>
                          <div className="flex justify-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                className={`${i < Math.round(averageRating || 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 mt-2">{reviews.length} reviews</p>
                        </div>
                        <div className="flex-1 min-w-[250px]">
                          {/* Rating distribution */}
                          {Array.from({ length: 5 }).map((_, i) => {
                            const rating = 5 - i
                            const count = reviews.filter((r) => Math.round(r.rating) === rating).length
                            const percentage = reviews.length ? (count / reviews.length) * 100 : 0

                            return (
                              <div key={rating} className="flex items-center mb-2">
                                <div className="w-8 text-sm font-medium text-gray-700">{rating} ★</div>
                                <div className="flex-1 h-3 mx-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-400 transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <div className="w-10 text-sm text-gray-600 text-right">{count}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Review filters */}
                      <div className="flex flex-wrap items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={handleFilterByRating}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${filterRating
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                              }`}
                          >
                            {filterRating ? `${filterRating} Stars` : "All Ratings"}
                          </button>
                        </div>
                        <button
                          onClick={handleSortByRecent}
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 bg-white rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <span>{sortByRecent ? "Most Recent" : "Highest Rated"}</span>
                        </button>
                      </div>

                      {/* Review list */}
                      <div className="space-y-6">
                        {filteredAndSortedReviews.length > 0 ? (
                          filteredAndSortedReviews.map((review) => (
                            <div
                              key={review.id}
                              className="border-b border-gray-200 pb-6 hover:bg-gray-50 p-4 rounded-lg -mx-4 transition-colors"
                            >
                              <div className="flex justify-between">
                                <div className="flex items-start">
                                  <div className="w-12 h-12 overflow-hidden rounded-full bg-gray-200 mr-4 border-2 border-white shadow-sm">
                                    {review.customerImage ? (
                                      <img
                                        src={review.customerImage || "/placeholder.svg"}
                                        alt={review.customerName || "Customer"}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold">
                                        {(review.customerName || "C").charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900">{review.customerName || "Customer"}</h3>
                                    <div className="flex items-center mt-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          size={14}
                                          className={`${i < Math.round(review.rating)
                                              ? "text-yellow-400 fill-yellow-400"
                                              : "text-gray-300"
                                            }`}
                                        />
                                      ))}
                                      <span className="ml-2 text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {/* Edit/Delete buttons for user's own reviews */}
                                {user && review.customer?.id === user.id && (
                                  <div className="flex space-x-1">
                                    <button 
                                      onClick={() => handleEditReview(review)}
                                      className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                                      title="Edit review"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteReview(review.id)}
                                      className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                                      title="Delete review"
                                      disabled={isDeletingReview}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p className="mt-4 text-gray-700">{review.comment}</p>

                              {/* Provider response if any */}
                              {review.providerResponse && (
                                <div className="mt-4 ml-12 pl-4 border-l-3 border-purple-300 bg-purple-50 p-3 rounded-r-lg">
                                  <div className="flex items-center mb-1">
                                    <MessageCircle size={16} className="text-purple-600 mr-2" />
                                    <p className="text-sm font-medium text-purple-800">
                                      Response from service provider
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-700">{review.providerResponse}</p>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No reviews match your filter.</p>
                            <button
                              onClick={() => setFilterRating(null)}
                              className="mt-2 text-purple-600 hover:text-purple-800 text-sm font-medium"
                            >
                              Clear filters
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <h2 className="text-2xl font-bold mb-2">No Reviews Yet</h2>
                      <p className="text-gray-600 mb-8">Be the first to review this service</p>
                      {user && canReview && (
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Write a Review
                        </button>
                      )}
                    </div>
                  )}

                  {/* Add review form */}
                  {user ? (
                    (canReview || isEditingReview) ? (
                      <div className="mt-8">
                        {showReviewForm ? (
                          <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-lg border border-purple-100 shadow-sm">
                            <h3 className="text-lg font-medium mb-4 text-gray-900">
                              {isEditingReview ? "Edit Your Review" : "Write a Review"}
                            </h3>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                              <div className="flex bg-white p-2 rounded-md inline-block">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <button key={i} type="button" onClick={() => setUserRating(i + 1)} className="p-1">
                                    <Star
                                      size={28}
                                      className={`${i < userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                        } transition-colors hover:scale-110 transform`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                              <textarea
                                value={userReview}
                                onChange={(e) => setUserReview(e.target.value)}
                                rows={4}
                                placeholder="Share your experience with this service..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={handleSubmitReview}
                                disabled={reviewLoading || userReview.trim() === ""}
                                className={`px-6 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 
                                  transition-colors ${reviewLoading || userReview.trim() === "" ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                {reviewLoading ? (
                                  <span className="flex items-center">
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                    {isEditingReview ? "Updating..." : "Submitting..."}
                                  </span>
                                ) : (
                                  isEditingReview ? "Update Review" : "Submit Review"
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setShowReviewForm(false)
                                  setIsEditingReview(false)
                                  setReviewToEditId(null)
                                  setUserReview("")
                                  setUserRating(5)
                                }}
                                className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowReviewForm(true)}
                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                          >
                            <Star size={18} />
                            Write a Review
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                        <p className="text-gray-600">
                          {reviews.some((r) => r.customerId === user.id)
                            ? "You've already reviewed this service"
                            : "Book and complete this service to leave a review"}
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="mt-8 p-5 bg-gray-50 rounded-lg text-center border border-gray-200">
                      <p className="text-gray-600 mb-3">Please log in to review this service</p>
                      <Link
                        to="/login"
                        className="inline-block px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Log in
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Documents tab */}
              {activeTab === "documents" && service.pdfPath && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold mb-6">Service Documents</h2>
                  <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-lg border border-purple-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-3 rounded-lg mr-4">
                        <FileText size={28} className="text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Service Information Document</h3>
                        <p className="text-sm text-gray-500">PDF with detailed service information</p>
                      </div>
                    </div>
                    <a
                      href={getServicePdfUrl(service.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Provider info and booking form */}
          <div className="space-y-6">
            {/* Price and booking card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-6">
              <div className="mb-5">
                <div className="flex items-baseline">
                  <div className="text-3xl font-bold text-gray-900">Rs. {service.price.toFixed(2)}</div>
                  {service.priceUnit && <div className="text-sm text-gray-500 ml-2">per {service.priceUnit}</div>}
                </div>
                <div className="mt-1 flex items-center">
                  <Clock size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-500">
                    {service.durationHours ? `${service.durationHours} hours` : "Duration varies"}
                  </span>
                </div>
              </div>

              {/* Book now button */}
              {user ? (
                service.status === "APPROVED" ? (
                  <button
                    onClick={() => {
                      console.log("Navigating to booking page with ID:", service.id)
                      navigate(`/booking/${service.id}`)
                    }}
                    className="w-full py-3.5 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <Calendar size={18} />
                    Book Now
                  </button>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <p className="text-yellow-800 text-sm flex items-start">
                      <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                      <span>
                        This service is currently {service.status.toLowerCase()} and not available for booking.
                      </span>
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-3">Please log in to book this service</p>
                  <Link
                    to="/login"
                    className="block w-full py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Log in to Book
                  </Link>
                </div>
              )}

              {/* Booking form */}
              {showBookingForm && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Book this Service</h3>
                  
                  {bookingSuccess ? (
                    <div className="bg-green-50 p-4 rounded-md mb-4">
                      <div className="flex items-start">
                        <CheckCircle className="text-green-500 mt-0.5 mr-2" size={20} />
                        <div>
                          <h4 className="font-semibold text-green-800">Booking Successful!</h4>
                          <p className="text-green-700 mt-1">
                            Your booking request has been submitted successfully. Redirecting to your bookings page...
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleBookService}>
                      <div className="space-y-4">
                        {bookingError && (
                          <div className="bg-red-50 p-4 rounded-md mb-4">
                            <div className="flex">
                              <XCircle className="text-red-500 mr-2" size={20} />
                              <p className="text-red-700">{bookingError}</p>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            id="bookingDate"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                          </label>
                          <input
                            type="time"
                            id="bookingTime"
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Choose a time between the service provider's working hours.
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="bookingNotes" className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (Optional)
                          </label>
                          <textarea
                            id="bookingNotes"
                            value={bookingNotes}
                            onChange={(e) => setBookingNotes(e.target.value)}
                            rows={3}
                            placeholder="Add any specific details or requirements for your booking"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-md">
                          <div className="flex items-start">
                            <AlertTriangle className="text-blue-500 mt-0.5 mr-2" size={20} />
                            <div className="text-sm text-blue-700">
                              <p>
                                Your booking will start in the <strong>PENDING</strong> status. The service provider needs to confirm it before it's finalized.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => setShowBookingForm(false)}
                            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={bookingLoading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {bookingLoading ? (
                              <span className="flex items-center">
                                <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Processing...
                              </span>
                            ) : (
                              "Book Now"
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {provider && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-medium mb-4">About the Provider</h3>
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 overflow-hidden rounded-full bg-gray-200 mr-4 border-2 border-white shadow-sm">
                    {provider.name?.charAt(0).toUpperCase() || "P"}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{provider.name}</h4>
                    <p className="text-sm text-gray-500">Service Provider</p>
                  </div>
                </div>

                {/* Provider contact */}
                {service.status === "APPROVED" && (
                  <div className="space-y-3 mt-4 bg-gray-50 p-4 rounded-lg">
                    {provider.phone && (
                      <div className="flex items-center">
                        <Phone size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm">{provider.phone}</span>
                      </div>
                    )}
                    {provider.email && (
                      <div className="flex items-center">
                        <Mail size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm">{provider.email}</span>
                      </div>
                    )}
                    {provider.website && (
                      <div className="flex items-center">
                        <Globe size={16} className="text-gray-500 mr-2" />
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 hover:underline"
                        >
                          {provider.website.replace(/(^\w+:|^)\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link
                    to={`/providers/${provider.id}`}
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium"
                  >
                    View Provider Profile
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}