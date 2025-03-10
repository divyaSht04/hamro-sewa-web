import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, X, ChevronLeft, ChevronRight, Search, FileText, Edit, Trash2, PlusCircle, Filter, Download, ExternalLink, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import ServiceProviderLayout from "../../components/serviceProvider/ServiceProviderLayout"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { getProviderServices, deleteService, getServiceImageUrl, getServicePdfUrl } from "../../services/providerServiceApi"
import { useAuth } from "../../auth/AuthContext"
import axios from 'axios'

export function ServiceProviderServiceList() {
  const [services, setServices] = useState([])
  
  const [selectedService, setSelectedService] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [servicesPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isLoading, setIsLoading] = useState(false)
  const [viewingDocument, setViewingDocument] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const { user } = useAuth()
  
  // PDF viewer state
  const [pdfLoading, setPdfLoading] = useState(true)
  const [pdfError, setPdfError] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

  const categories = ["All", "Cleaning", "Maintenance", "Electrical", "Plumbing", "Carpentry", "Painting", "Gardening", "Home Improvement", "Professional Services", "Education", "Health & Wellness", "Beauty", "Other"]
  const statuses = ["All", "APPROVED", "PENDING", "REJECTED"]

  useEffect(() => {
    const fetchServices = async () => {
      if (!user?.id) return;
      
      setIsLoading(true)
      try {
        const data = await getProviderServices(user.id);
        // Transform the data to match our component's expected format
        const formattedServices = data.map(service => ({
          id: service.id,
          name: service.serviceName,
          category: service.category,
          price: service.price,
          status: service.status || "PENDING", // Default to pending if status is not provided
          description: service.description,
          attachedFile: service.pdfPath,
          image: service.imagePath ? getServiceImageUrl(service.id) : null,
          createdAt: new Date(service.createdAt).toISOString().split('T')[0],
          bookings: service.bookings || 0,
          adminFeedback: service.adminFeedback,
        }));
        
        setServices(formattedServices);
      } catch (error) {
        console.error("Failed to fetch services:", error)
        toast.error("Failed to load services")
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [user?.id])

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

  const openDocumentViewer = async (serviceId) => {
    if (!serviceId) {
      toast.error("No PDF document available");
      return;
    }
    
    // Reset PDF viewer state
    setPdfLoading(true);
    setPdfError(false);
    setPdfBlobUrl(null);
    
    try {
      // Set the viewing document to show the PDF viewer modal
      setViewingDocument(serviceId);
      
      // Get the PDF data as a blob
      const response = await axios.get(getServicePdfUrl(serviceId), {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      // Create a blob URL from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setPdfBlobUrl(url);
      setPdfLoading(false);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setPdfLoading(false);
      setPdfError(true);
    }
  }

  const closeDocumentViewer = () => {
    // Revoke the blob URL to free up memory
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
    }
    
    setViewingDocument(null);
    setPdfBlobUrl(null);
  }

  const downloadPdf = (serviceId, serviceName) => {
    if (!serviceId) {
      toast.error("No PDF document available");
      return;
    }
    
    const pdfUrl = getServicePdfUrl(serviceId);
    
    // Open in a new tab for download
    window.open(pdfUrl, '_blank');
  }


  const confirmDelete = (id) => {
    setShowDeleteConfirm(id)
  }

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
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
      case "APPROVED":
        return "bg-green-100 text-green-600 border border-green-200"
      case "REJECTED":
        return "bg-red-100 text-red-600 border border-red-200"
      default:
        return "bg-amber-100 text-amber-600 border border-amber-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle size={14} className="mr-1.5" />
      case "REJECTED":
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
                          {service.attachedFile && (
                            <button
                              onClick={() => openDocumentViewer(service.id)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <FileText size={16} className="mr-1.5" />
                              PDF
                            </button>
                          )}
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
                          onClick={() => openDocumentViewer(selectedService.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors border border-indigo-200"
                        >
                          <FileText size={16} className="mr-1.5" />
                          View PDF
                        </button>
                        <button
                          onClick={() => downloadPdf(selectedService.id, selectedService.name)}
                          className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Download size={16} className="mr-1.5" />
                          Download
                        </button>
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

              {selectedService.status === "REJECTED" && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Feedback from Admin</h3>
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
                    <div className="flex items-start">
                      <XCircle className="text-rose-500 mt-0.5 mr-3 flex-shrink-0" size={18} />
                      <div>
                        <p className="text-rose-700 font-medium mb-1">Your service was rejected</p>
                        <p className="text-gray-700">{selectedService.adminFeedback || "No specific feedback provided."}</p>
                      </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* PDF Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col h-[85vh]"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FileText className="inline mr-2 text-green-600" size={20} />
                Document Viewer
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const service = services.find(s => s.id === viewingDocument);
                    if (service) {
                      downloadPdf(viewingDocument, service.name);
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Download document"
                >
                  <Download size={20} className="text-gray-600" />
                </button>
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
              <div className="w-full h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
                {pdfLoading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  </div>
                )}
                
                {pdfError && (
                  <div className="text-center p-6 max-w-md mx-auto">
                    <div className="w-20 h-24 mx-auto bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mb-4 relative">
                      <FileText size={32} className="text-gray-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load PDF</h4>
                    <p className="text-gray-600 mb-6">
                      There was an error loading the PDF. Please try downloading it instead.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => {
                          const service = services.find(s => s.id === viewingDocument);
                          if (service) {
                            downloadPdf(viewingDocument, service.name);
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <Download size={16} className="mr-2" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}
                
                {!pdfLoading && !pdfError && pdfBlobUrl && (
                  <iframe 
                    src={pdfBlobUrl}
                    className="w-full h-full"
                    title="PDF Viewer"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </ServiceProviderLayout>
  )
}