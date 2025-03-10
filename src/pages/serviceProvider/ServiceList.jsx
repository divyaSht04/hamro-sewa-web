import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, X, ChevronLeft, ChevronRight, Search, FileText, Edit, Trash2, PlusCircle, Filter, Download, ExternalLink, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import ServiceProviderLayout from "../../components/serviceProvider/ServiceProviderLayout"
import { Link } from "react-router-dom"
import api from "../../api/api"
import toast from "react-hot-toast"

export function ServiceProviderServiceList() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Home Cleaning",
      category: "Cleaning",
      price: 50,
      status: "Approved",
      description: "Professional home cleaning services for a sparkling clean living space. We use eco-friendly cleaning products and follow a detailed checklist to ensure your home is spotless.",
      providerImage: "https://randomuser.me/api/portraits/women/1.jpg",
      providerName: "Alice Johnson",
      attachedFile: "home_cleaning_details.pdf",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      createdAt: "2023-04-15",
      bookings: 12
    },
    {
      id: 2,
      name: "Plumbing Service",
      category: "Maintenance",
      price: 75,
      status: "Pending",
      description: "Expert plumbing solutions for all your household needs. From fixing leaks to installing new plumbing systems, our qualified plumbers provide reliable service.",
      providerImage: "https://randomuser.me/api/portraits/men/2.jpg",
      providerName: "Bob Smith",
      attachedFile: "plumbing_services.pdf",
      image: "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      createdAt: "2023-05-22",
      bookings: 8
    },
    {
      id: 3,
      name: "Electrical Repairs",
      category: "Maintenance",
      price: 80,
      status: "Rejected",
      description: "Comprehensive electrical services by certified electricians. We handle everything from wiring issues to electrical upgrades with safety as our top priority.",
      providerImage: "https://randomuser.me/api/portraits/women/3.jpg",
      providerName: "Carol Davis",
      attachedFile: "electrical_work_info.pdf",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      createdAt: "2023-06-10",
      bookings: 0,
      rejectionReason: "Documentation incomplete. Please provide certification documents."
    },
    {
      id: 4,
      name: "Garden Landscaping",
      category: "Outdoor",
      price: 120,
      status: "Approved",
      description: "Transform your outdoor space with our professional landscaping services. We design and implement beautiful garden solutions tailored to your preferences.",
      providerImage: "https://randomuser.me/api/portraits/men/4.jpg",
      providerName: "David Wilson",
      attachedFile: "landscaping_services.pdf",
      image: "https://images.unsplash.com/photo-1599629954294-14df9ec8dfe8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      createdAt: "2023-06-15",
      bookings: 5
    },
  ])
  
  const [selectedService, setSelectedService] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [servicesPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isLoading, setIsLoading] = useState(false)
  const [viewingDocument, setViewingDocument] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const categories = ["All", "Cleaning", "Maintenance", "Outdoor", "Home Improvement", "Professional"]
  const statuses = ["All", "Approved", "Pending", "Rejected"]

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true)
      try {
        // In a real application, this would be an API call
        // const response = await api.get("/services/provider")
        // setServices(response.data)
      } catch (error) {
        console.error("Failed to fetch services:", error)
        toast.error("Failed to load services")
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  const filteredServices = services.filter(
    (service) => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === "All" || service.category === categoryFilter
      const matchesStatus = statusFilter === "All" || service.status === statusFilter
      
      return matchesSearch && matchesCategory && matchesStatus
    }
  )

  const indexOfLastService = currentPage * servicesPerPage
  const indexOfFirstService = indexOfLastService - servicesPerPage
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService)
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage)

  const openServiceDetails = (service) => {
    setSelectedService(service)
  }

  const closeServiceDetails = () => {
    setSelectedService(null)
  }

  const openDocumentViewer = (fileName) => {
    setViewingDocument(fileName)
  }

  const closeDocumentViewer = () => {
    setViewingDocument(null)
  }

  const confirmDelete = (id) => {
    setShowDeleteConfirm(id)
  }

  const handleDelete = (id) => {
    try {
      // In a real application, this would be an API call
      // await api.delete(`/services/${id}`)
      setServices(services.filter(service => service.id !== id))
      setShowDeleteConfirm(null)
      toast.success("Service deleted successfully")
    } catch (error) {
      console.error("Failed to delete service:", error)
      toast.error("Failed to delete service")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-600 border border-green-200"
      case "Rejected":
        return "bg-red-100 text-red-600 border border-red-200"
      default:
        return "bg-amber-100 text-amber-600 border border-amber-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={14} className="mr-1.5" />
      case "Rejected":
        return <XCircle size={14} className="mr-1.5" />
      default:
        return <Clock size={14} className="mr-1.5" />
    }
  }

  return (
    <ServiceProviderLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Services</h1>
            <p className="text-gray-600 mt-1">Manage and monitor your service listings</p>
          </div>
          <Link 
            to="/provider/services/new" 
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center shadow-sm hover:bg-green-600 transition-colors"
          >
            <PlusCircle size={18} className="mr-2" />
            Add New Service
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <select 
                      className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category} Categories</option>
                      ))}
                    </select>
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" size={16} />
                  </div>
                  
                  <div className="relative">
                    <select 
                      className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status} Status</option>
                      ))}
                    </select>
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {filteredServices.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">No services found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                  <Link 
                    to="/provider/services/new" 
                    className="bg-green-500 text-white px-4 py-2 rounded-lg inline-flex items-center hover:bg-green-600 transition-colors"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Add New Service
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto divide-y divide-gray-100">
                  {currentServices.map((service) => (
                    <motion.div 
                      key={service.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <img 
                            src={service.image || "/placeholder.svg"} 
                            alt={service.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{service.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                                {getStatusIcon(service.status)}
                                {service.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(service.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{service.description}</p>
                          
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="text-gray-700 font-medium">${service.price}</span>
                            <span className="text-gray-500">Category: {service.category}</span>
                            {service.bookings > 0 && (
                              <span className="text-green-600 font-medium">{service.bookings} bookings</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
                          <button
                            onClick={() => openServiceDetails(service)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Eye size={16} className="mr-1.5" />
                            View
                          </button>
                          <Link
                            to={`/provider/services/edit/${service.id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Edit size={16} className="mr-1.5" />
                            Edit
                          </Link>
                          <button
                            onClick={() => confirmDelete(service.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                          >
                            <Trash2 size={16} className="mr-1.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {filteredServices.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-auto overflow-hidden relative"
          >
            <div className="relative h-48 bg-gradient-to-r from-green-500 to-emerald-600 overflow-hidden">
              <img 
                src={selectedService.image || "/placeholder.svg"}
                alt={selectedService.name}
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={closeServiceDetails}
                  className="p-2 bg-white bg-opacity-20 backdrop-blur-md rounded-full hover:bg-opacity-30 transition-colors text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-2xl font-bold text-white">{selectedService.name}</h2>
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-25 text-white backdrop-blur-md mr-2`}>
                    {selectedService.category}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedService.status)}`}>
                    {getStatusIcon(selectedService.status)}
                    {selectedService.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Service Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-lg font-semibold text-gray-900">${selectedService.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created on</p>
                        <p className="text-gray-700">{new Date(selectedService.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Bookings</p>
                        <p className="text-gray-700">{selectedService.bookings || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Documents & Media</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Service Document</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDocumentViewer(selectedService.attachedFile)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors border border-indigo-200"
                        >
                          <FileText size={16} className="mr-1.5" />
                          View PDF
                        </button>
                        <a
                          href={`/files/${selectedService.attachedFile}`}
                          download
                          className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Download size={16} className="mr-1.5" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{selectedService.description}</p>
                </div>
              </div>

              {selectedService.status === "Rejected" && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Rejection Reason</h3>
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-rose-700">{selectedService.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <Link
                  to={`/provider/services/edit/${selectedService.id}`}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Service
                </Link>
                <button
                  onClick={() => confirmDelete(selectedService.id)}
                  className="inline-flex items-center px-4 py-2 bg-rose-50 border border-rose-300 rounded-md shadow-sm text-sm font-medium text-rose-700 hover:bg-rose-100 focus:outline-none"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Service
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col h-[85vh]"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FileText size={20} className="inline mr-2 text-green-600" />
                {viewingDocument}
              </h3>
              <div className="flex items-center space-x-2">
                <a
                  href={`/files/${viewingDocument}`}
                  download
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Download document"
                >
                  <Download size={20} className="text-gray-600" />
                </a>
                <a
                  href={`/files/${viewingDocument}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink size={20} className="text-gray-600" />
                </a>
                <button
                  onClick={closeDocumentViewer}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex items-center justify-center overflow-auto">
                {/* Document preview - in a real app, you would use a PDF viewer or document preview component */}
                <div className="text-center p-8">
                  <div className="w-24 h-32 mx-auto bg-gradient-to-b from-green-50 to-emerald-50 rounded-lg border border-gray-200 flex items-center justify-center mb-4 relative shadow-md">
                    <FileText size={36} className="text-green-600" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold text-green-700">PDF</span>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium mb-4">Preview not available in this demo</p>
                  <p className="text-sm text-gray-500">
                    In a real application, a PDF or document viewer would be integrated here
                  </p>
                  <div className="mt-8">
                    <a
                      href={`/files/${viewingDocument}`}
                      download
                      className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors font-medium shadow-sm"
                    >
                      <Download size={18} className="mr-2" />
                      Download Document
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Service</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this service? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md hover:bg-rose-700 focus:outline-none"
                  onClick={() => handleDelete(showDeleteConfirm)}
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </ServiceProviderLayout>
  )
}