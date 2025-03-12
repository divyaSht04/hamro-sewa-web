"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { Search, Grid, Home, Trash2, Flower2, PaintBucket, Sofa, Star, Clock, DollarSign, PenToolIcon as Tool, Zap, Building2, Bug, Info } from 'lucide-react'

const services = [
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
  {
    id: 2,
    name: "Office Cleaning",
    category: "Cleaning",
    provider: "OfficeSpark",
    description: "Comprehensive office cleaning solutions",
    image:
      "https://images.unsplash.com/photo-1613385102957-e1c98359ba17?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.7,
    duration: "3-4 hours",
    price: "$100-$200",
    icon: Building2,
  },
  {
    id: 3,
    name: "Plumbing",
    category: "Maintenance",
    provider: "FixIt Plumbers",
    description: "Expert plumbing services for your home",
    image:
      "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.9,
    duration: "1-2 hours",
    price: "$75-$150",
    icon: Trash2,
  },
  {
    id: 4,
    name: "Electrical Work",
    category: "Maintenance",
    provider: "Volt Masters",
    description: "Professional electrical services",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.8,
    duration: "1-3 hours",
    price: "$80-$200",
    icon: Zap,
  },
  {
    id: 5,
    name: "Gardening",
    category: "Outdoor",
    provider: "Green Thumb",
    description: "Expert gardening and landscaping services",
    image:
      "https://images.unsplash.com/photo-1599629954294-14df9ec8dfe8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.6,
    duration: "2-4 hours",
    price: "$60-$120",
    icon: Flower2,
  },
  {
    id: 6,
    name: "Interior Painting",
    category: "Painting",
    provider: "ColorWorks",
    description: "Professional interior painting services",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.7,
    duration: "4-8 hours",
    price: "$200-$500",
    icon: PaintBucket,
  },
  {
    id: 7,
    name: "Exterior Painting",
    category: "Painting",
    provider: "FreshCoat Pros",
    description: "Expert exterior painting services",
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.8,
    duration: "1-3 days",
    price: "$500-$2000",
    icon: PaintBucket,
  },
  {
    id: 8,
    name: "Decorative Painting",
    category: "Painting",
    provider: "ArtBrush Decor",
    description: "Creative decorative painting solutions",
    image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.9,
    duration: "1-5 days",
    price: "$300-$1500",
    icon: PaintBucket,
  },
  {
    id: 9,
    name: "Furniture Assembly",
    category: "Home Improvement",
    provider: "AssembleEase",
    description: "Expert furniture assembly service",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.6,
    duration: "1-4 hours",
    price: "$50-$150",
    icon: Sofa,
  },
  {
    id: 10,
    name: "Pest Control",
    category: "Maintenance",
    provider: "BugBusters",
    description: "Effective pest control solutions",
    image:
      "https://images.unsplash.com/photo-1611274757139-82be3bb5d7b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.9,
    duration: "1-2 hours",
    price: "$100-$200",
    icon: Bug,
  },
]

// Export services for use in other components
export { services }

const categories = ["All", ...new Set(services.map((service) => service.category))]

export default function ServicePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredServices, setFilteredServices] = useState(services)

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        (selectedCategory === "All" || service.category === selectedCategory) &&
        (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.provider.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredServices(filtered)
  }, [selectedCategory, searchTerm])

  const getCategoryIcon = (category) => {
    switch (category) {
      case "All":
        return <Grid className="w-5 h-5" />
      case "Cleaning":
        return <Home className="w-5 h-5" />
      case "Maintenance":
        return <Tool className="w-5 h-5" />
      case "Outdoor":
        return <Flower2 className="w-5 h-5" />
      case "Painting":
        return <PaintBucket className="w-5 h-5" />
      case "Home Improvement":
        return <Sofa className="w-5 h-5" />
      default:
        return <Grid className="w-5 h-5" />
    }
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
                    {categories.map(category => (
                      <motion.button
                        key={category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`w-full flex items-center p-3 rounded-md cursor-pointer mb-2 transition-all duration-200 ${
                          selectedCategory === category 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="mr-3">
                          {getCategoryIcon(category)}
                        </div>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {selectedCategory === "All" ? "All Services" : `${selectedCategory} Services`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredServices.map((service) => (
                    <motion.div
                      key={service.id}
                      className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                          <div className="p-4 w-full">
                            <h3 className="text-xl font-bold text-white">{service.name}</h3>
                            <p className="text-white/80 text-sm">{service.provider}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex items-center justify-between mb-4 text-sm">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-semibold">{service.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-gray-600">{service.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-gray-600">{service.price}</span>
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
                          <button className="flex-1 bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}