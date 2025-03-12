"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Star,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Check,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
} from "lucide-react"
import { services } from "./ServicePage"

// Sample reviews data
const reviews = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    date: "2023-10-15",
    comment:
      "Excellent service! They were punctual, professional, and did an amazing job. Would definitely recommend to anyone looking for quality service.",
    helpful: 24,
    replies: [],
  },
  {
    id: 2,
    user: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 4,
    date: "2023-09-28",
    comment:
      "Very good service overall. The team was professional and completed the job efficiently. Only minor issue was they were about 15 minutes late.",
    helpful: 12,
    replies: [
      {
        id: 101,
        user: "Service Provider",
        isProvider: true,
        date: "2023-09-29",
        comment:
          "Thank you for your feedback, Michael! We apologize for the slight delay and appreciate your understanding. We're glad you were satisfied with our service!",
      },
    ],
  },
  {
    id: 3,
    user: "Emily Rodriguez",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    rating: 5,
    date: "2023-09-10",
    comment:
      "I've used this service multiple times and they never disappoint. Always thorough, friendly, and they go above and beyond. Highly recommend!",
    helpful: 31,
    replies: [],
  },
]

export default function ServiceDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [userReview, setUserReview] = useState("")
  const [userRating, setUserRating] = useState(5)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [allReviews, setAllReviews] = useState(reviews)
  const [filterRating, setFilterRating] = useState(null)
  const [sortByRecent, setSortByRecent] = useState(false)

  useEffect(() => {
    // Simulate loading data
    setLoading(true)
    setTimeout(() => {
      const foundService = services.find((s) => s.id === Number.parseInt(id))
      setService(foundService)
      setLoading(false)
    }, 500)
  }, [id])

  const handleSubmitReview = () => {
    if (userReview.trim() === "") return

    const newReview = {
      id: allReviews.length + 1,
      user: "You",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      rating: userRating,
      date: new Date().toISOString().split("T")[0],
      comment: userReview,
      helpful: 0,
      replies: [],
    }

    setAllReviews([newReview, ...allReviews])
    setUserReview("")
    setShowReviewForm(false)
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

  const filteredAndSortedReviews = [...allReviews]
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
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
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img src={service.image || "/placeholder.svg"} alt={service.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 text-white/90 mb-2">
              <span className="px-3 py-1 bg-purple-600 rounded-full text-xs font-medium">{service.category}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" fill="#facc15" />
                <span className="text-sm font-medium">{service.rating}</span>
                <span className="text-sm text-white/70">({reviews.length} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{service.name}</h1>
            <p className="text-white/90 text-lg">Provided by {service.provider}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Service details */}
          <div className="w-full lg:w-2/3">
            {/* Tabs */}
            <div className="bg-white rounded-t-lg shadow-sm mb-1">
              <div className="flex border-b">
                {["overview", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "text-purple-600 border-b-2 border-purple-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-b-lg shadow-md p-6 mb-8">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Overview</h2>
                    <p className="text-gray-600 mb-6">{service.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Duration</h3>
                          <p className="text-gray-600">{service.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Price Range</h3>
                          <p className="text-gray-600">{service.price}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Availability</h3>
                          <p className="text-gray-600">Monday to Saturday, 8AM - 6PM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Service Area</h3>
                          <p className="text-gray-600">Within 30 miles of city center</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-4">What's Included</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                      {[
                        "Professional service providers",
                        "High-quality equipment and supplies",
                        "Satisfaction guarantee",
                        "Insured and bonded professionals",
                        "Flexible scheduling options",
                        "Customer support",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-xl font-bold text-gray-800 mb-4">About the Provider</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-purple-600">{service.provider.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{service.provider}</h4>
                        <p className="text-gray-600">Service Provider since 2018</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {service.provider} is a leading provider of {service.category.toLowerCase()} services, committed
                      to delivering exceptional quality and customer satisfaction. With years of experience in the
                      industry, we pride ourselves on our attention to detail and professional approach.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          contact@{service.provider.toLowerCase().replace(/\s+/g, "")}.com
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          www.{service.provider.toLowerCase().replace(/\s+/g, "")}.com
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" fill="#facc15" />
                        <span className="font-semibold text-lg">{service.rating}</span>
                        <span className="text-gray-600">({reviews.length} reviews)</span>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <button
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                          onClick={() => setShowReviewForm(!showReviewForm)}
                        >
                          {showReviewForm ? "Cancel" : "Write a Review"}
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleFilterByRating}
                            className={`flex items-center gap-1 px-3 py-1 text-sm border rounded-md transition-colors ${
                              filterRating
                                ? "border-purple-600 text-purple-600 bg-purple-50"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Star className="w-4 h-4" />
                            <span>{filterRating ? `${filterRating} Stars` : "Rating"}</span>
                          </button>
                          <button
                            onClick={handleSortByRecent}
                            className={`flex items-center gap-1 px-3 py-1 text-sm border rounded-md transition-colors ${
                              sortByRecent
                                ? "border-purple-600 text-purple-600 bg-purple-50"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Recent</span>
                          </button>
                        </div>
                      </div>

                      {showReviewForm && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                          <h3 className="font-medium text-gray-800 mb-3">Write Your Review</h3>
                          <div className="mb-3">
                            <label className="block text-sm text-gray-600 mb-1">Rating</label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setUserRating(star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className="w-6 h-6 mr-1"
                                    fill={star <= userRating ? "#facc15" : "#e5e7eb"}
                                    color={star <= userRating ? "#facc15" : "#e5e7eb"}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm text-gray-600 mb-1">Your Review</label>
                            <textarea
                              value={userReview}
                              onChange={(e) => setUserReview(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              rows={4}
                              placeholder="Share your experience with this service..."
                            ></textarea>
                          </div>
                          <button
                            onClick={handleSubmitReview}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            disabled={userReview.trim() === ""}
                          >
                            Submit Review
                          </button>
                        </div>
                      )}

                      <div className="space-y-6">
                        {filteredAndSortedReviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                            <div className="flex items-start gap-4">
                              <img
                                src={review.avatar || "/placeholder.svg"}
                                alt={review.user}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold text-gray-900">{review.user}</h3>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-4 h-4 mr-0.5"
                                      fill={i < review.rating ? "#facc15" : "#e5e7eb"}
                                      color={i < review.rating ? "#facc15" : "#e5e7eb"}
                                    />
                                  ))}
                                </div>
                                <p className="text-gray-700 mb-3">{review.comment}</p>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Helpful ({review.helpful})</span>
                                  </button>
                                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Reply</span>
                                  </button>
                                </div>

                                {/* Replies */}
                                {review.replies.length > 0 && (
                                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                                    {review.replies.map((reply) => (
                                      <div key={reply.id} className="mb-3 last:mb-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span
                                            className={`font-semibold ${reply.isProvider ? "text-purple-600" : "text-gray-900"}`}
                                          >
                                            {reply.user}
                                          </span>
                                          <span className="text-xs text-gray-500">{reply.date}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{reply.comment}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right column - Booking */}
          <div className="w-full lg:w-1/3">
            {/* Booking card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Book This Service</h2>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Service Price</span>
                  <span className="font-medium">{service.price}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Service Fee</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total</span>
                  <span className="text-purple-600">$110.00</span>
                </div>
              </div>

              <button
                className="w-full py-3 rounded-md font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                onClick={() => alert("Booking service: " + service.name)}
              >
                Book Now
              </button>

              <div className="flex items-center justify-center gap-4 mt-4">
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}