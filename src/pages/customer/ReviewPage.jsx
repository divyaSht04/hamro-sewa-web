import React, { useState, useEffect } from 'react'
import { Star, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { createReview, updateReview, getReviewByBookingId } from '../../services/reviewService'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'

const ReviewPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get booking and isEditing from route state
  const { booking, isEditing = false } = location.state || {}
  
  // Review state
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditMode, setIsEditMode] = useState(isEditing)
  const [reviewId, setReviewId] = useState(null)

  // Redirect if no booking data was passed
  useEffect(() => {
    if (!booking) {
      toast.error('No booking information provided')
      navigate('/customer/bookings')
    }
  }, [booking, navigate])

  // Fetch review data if in edit mode
  useEffect(() => {
    if (booking && isEditing) {
      fetchReviewForBooking(booking.id)
    }
  }, [booking, isEditing])

  // Function to fetch a review for a specific booking ID
  const fetchReviewForBooking = async (bookingId) => {
    try {
      console.log('Attempting to fetch review directly for booking ID:', bookingId)
      const review = await getReviewByBookingId(bookingId)
      
      if (review) {
        console.log('Successfully found review using booking ID API:', review)
        setReviewText(review.comment || "")
        setReviewRating(review.rating || 5)
        setReviewId(review.id)
        setIsEditMode(true)
      } else {
        console.error('Review data was empty for booking ID:', bookingId)
        toast.error('Could not find your review. Please try refreshing the page.')
      }
    } catch (error) {
      console.error('Error fetching review for booking:', error)
      toast.error('Could not retrieve your review: ' + (error.response?.data || error.message))
    }
  }

  const handleGoBack = () => {
    navigate('/customer/bookings')
  }

  const handleSubmitReview = async () => {
    // Validate input
    if (!booking) {
      toast.error("An error occurred. No booking selected.")
      return
    }
    
    if (!user?.id) {
      toast.error("Please log in to submit a review")
      return
    }
    
    if (reviewRating < 1 || reviewRating > 5) {
      toast.error("Please select a rating between 1 and 5 stars")
      return
    }
    
    if (!reviewText.trim()) {
      toast.error("Please provide some feedback in your review")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Determine service ID from booking
      let serviceId = null;
      
      if (booking.providerService?.id) {
        serviceId = booking.providerService.id;
      } else if (booking.provider_service_id) {
        serviceId = booking.provider_service_id;
      } else {
        toast.error('Could not determine service ID. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      const reviewData = {
        bookingId: booking.id,
        rating: reviewRating,
        comment: reviewText,
        customerId: user.id,
        providerServiceId: serviceId
      }
      
      if (isEditMode && reviewId) {
        await updateReview(reviewId, reviewData)
        toast.success("Review updated successfully")
      } else {
        await createReview(reviewData)
        toast.success("Review submitted successfully")
      }
      
      // Navigate back to bookings page
      navigate('/customer/bookings')
    } catch (error) {
      console.error("Error submitting review:", error)
      if (error.response?.data?.includes("already exists for this booking")) {
        toast.error("You have already reviewed this booking")
      } else if (error.response?.data?.includes("hasn't been completed")) {
        toast.error("You can only review completed services")
      } else {
        toast.error("Failed to submit review. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 sm:px-8 sm:py-6 flex items-center">
            <button 
              onClick={handleGoBack}
              className="mr-4 p-1 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isEditMode ? "Edit Your Review" : "Write a Review"}
              </h1>
              <p className="text-purple-100 mt-1">Share your experience with this service</p>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
              <p className="font-medium text-indigo-800 mb-1">Service Details</p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Service:</span> {
                  booking?.providerService?.serviceName || 
                  booking?.service?.serviceName || 
                  booking?.bookingDetails?.[0]?.serviceName || 
                  'Unnamed Service'
                }
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Booking ID:</span> #{booking?.id}
              </p>
            </div>
            
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-800 mb-3">
                Your Rating
              </label>
              <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${
                      reviewRating >= star
                        ? "text-yellow-400 hover:text-yellow-500"
                        : "text-gray-300 hover:text-yellow-400"
                    } p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
                    onClick={() => setReviewRating(star)}
                  >
                    <Star className="h-8 w-8" />
                  </button>
                ))}
                <span className="ml-4 text-md text-gray-700 font-medium">
                  {reviewRating} out of 5 stars
                </span>
              </div>
            </div>
            
            <div className="mb-8">
              <label htmlFor="review-text" className="block text-lg font-medium text-gray-800 mb-3">
                Your Review
              </label>
              <textarea
                id="review-text"
                rows="6"
                className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full text-md border-gray-300 rounded-lg"
                placeholder="Share your experience with this service..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-4 px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleGoBack}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-6 py-3 rounded-md shadow-sm text-base font-medium text-white ${
                  isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isEditMode ? 'focus:ring-blue-500' : 'focus:ring-purple-500'
                }`}
                onClick={handleSubmitReview}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditMode ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  isEditMode ? "Update Review" : "Submit Review"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewPage
