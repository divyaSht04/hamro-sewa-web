"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Search,
  Grid,
  Home,
  Flower2,
  PaintBucket,
  Star,
  DollarSign,
  PenToolIcon as Tool,
  Zap,
  Info,
  ServerOff,
} from "lucide-react"
import { getApprovedServices, getServiceImageUrl } from "../../services/providerServiceApi"

// Fallback service data in case API fails
const fallbackServices = [
  {
    id: 1,
    name: "Home Cleaning",
    category: "Cleaning",
    provider: "CleanCo",
    description: "Professional home cleaning services",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.8,
    duration: "2-3 hours",
    price: "$50-$100",
    icon: Home,
  },
  // ... other fallback services
]

// Fallback images based on category
const fallbackImages = {
  Cleaning:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  Plumbing:
    "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  Electrical:
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  Gardening:
    "https://images.unsplash.com/photo-1599629954294-14df9ec8dfe8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  Painting: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  default:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
}

export default function ServicePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState(["All"])

  // Fetch approved services from the backend
  useEffect(() => {
    const fetchApprovedServices = async () => {
      try {
        setLoading(true)
        const data = await getApprovedServices()
        setServices(data)

        // Extract unique categories from the services
        const uniqueCategories = ["All", ...new Set(data.map((service) => service.category))]
        setCategories(uniqueCategories)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching approved services:", err)
        setError("Unable to load services. The server may be down or unavailable at the moment.")
        setServices([])
        setLoading(false)
      }
    }

    fetchApprovedServices()
  }, [])

  // Filter services based on category and search term
  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        (selectedCategory === "All" || service.category === selectedCategory) &&
        (service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (service.serviceProvider?.name &&
            service.serviceProvider.name.toLowerCase().includes(searchTerm.toLowerCase()))),
    )
    setFilteredServices(filtered)
  }, [selectedCategory, searchTerm, services])

  const getCategoryIcon = (category) => {
    switch (category) {
      case "All":
        return <Grid className="w-5 h-5" />
      case "Cleaning":
        return <Home className="w-5 h-5" />
      case "Plumbing":
        return <Tool className="w-5 h-5" />
      case "Electrical":
        return <Zap className="w-5 h-5" />
      case "Gardening":
        return <Flower2 className="w-5 h-5" />
      case "Painting":
        return <PaintBucket className="w-5 h-5" />
      default:
        return <Grid className="w-5 h-5" />
    }
  }

  // Get appropriate image for service
  const getImageForService = (service) => {
    if (service.imagePath) {
      return getServiceImageUrl(service.id)
    }
    return fallbackImages[service.category] || fallbackImages.default
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 w-48 bg-gray-200 rounded-md animate-pulse mb-8 mt-10"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar skeleton */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="h-10 bg-gray-200 rounded-md animate-pulse w-full"></div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded-md animate-pulse w-3/4 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-md animate-pulse w-full"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content skeleton */}
            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-8 bg-gray-200 rounded-md animate-pulse w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded-md animate-pulse w-1/6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <div className="p-4">
                        <div className="h-6 bg-gray-200 rounded-md animate-pulse w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/2 mb-4"></div>
                        <div className="h-20 bg-gray-200 rounded-md animate-pulse w-full mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-10 bg-gray-200 rounded-md animate-pulse w-1/2"></div>
                          <div className="h-10 bg-gray-200 rounded-md animate-pulse w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-red-500 mb-4">
          <ServerOff size={64} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Unavailable</h2>
        <p className="text-gray-600 mb-2 text-center max-w-md">{error}</p>
        <p className="text-gray-500 text-center max-w-md mb-8">
          Please try again later or contact support if the problem persists.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <span>Refresh Page</span>
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-10">Services</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search services or providers..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
                <div className="overflow-y-auto max-h-[calc(100vh-320px)] pr-2 -mr-2 space-y-2 custom-scrollbar">
                  <AnimatePresence>
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`w-full flex items-center p-3 rounded-md cursor-pointer mb-2 transition-all duration-200 ${
                          selectedCategory === category
                            ? "bg-purple-600 text-white shadow-md"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="mr-3">{getCategoryIcon(category)}</div>
                        <span className="font-medium">{category}</span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">{selectedCategory} Services</h2>
                  <span className="text-sm text-gray-500">{filteredServices.length} services found</span>
                </div>

                {filteredServices.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                      <Info size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-3">No Services Found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchTerm ? (
                        <>
                          No results found for "<span className="font-medium">{searchTerm}</span>". Please try a
                          different search term or category.
                        </>
                      ) : (
                        <>
                          {selectedCategory !== "All" ? (
                            <>No {selectedCategory} services are available at the moment.</>
                          ) : (
                            <>No services are available at the moment. Please check back later.</>
                          )}
                        </>
                      )}
                    </p>
                    <div className="flex justify-center gap-3">
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        >
                          Clear Search
                        </button>
                      )}
                      {selectedCategory !== "All" && (
                        <button
                          onClick={() => setSelectedCategory("All")}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                        >
                          View All Services
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredServices.map((service) => (
                      <motion.div
                        key={service.id}
                        className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -8, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={getImageForService(service) || "/placeholder.svg"}
                            alt={service.serviceName}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            onError={(e) => {
                              e.target.src = fallbackImages.default
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                            <div className="p-4 w-full">
                              <h3 className="text-xl font-bold text-white">{service.serviceName}</h3>
                              <p className="text-white/90 text-sm">
                                {service.serviceProvider?.name || "Unknown Provider"}
                              </p>
                            </div>
                          </div>
                          {service.category && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-1 bg-purple-600/90 text-white text-xs rounded-full backdrop-blur-sm">
                                {service.category}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <p className="text-gray-600 mb-4 line-clamp-2 h-12">{service.description}</p>
                          <div className="flex items-center justify-between mb-4 text-sm">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="font-semibold">
                                {service.reviews && service.reviews.length > 0
                                  ? (
                                      service.reviews.reduce((acc, review) => acc + review.rating, 0) /
                                      service.reviews.length
                                    ).toFixed(1)
                                  : "New"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                              <span className="text-gray-600 font-medium">Rs. {service.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to={`/service-details/${service.id}`}
                              className="flex-1 flex items-center justify-center gap-2 bg-white border border-purple-600 text-purple-600 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                            >
                              <Info size={16} />
                              <span>View Details</span>
                            </Link>
                            <Link
                              to={`/service-details/${service.id}`}
                              className="flex-1 bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}