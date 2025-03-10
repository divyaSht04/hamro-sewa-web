"use client"

import { useState } from "react"
import {
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle,
  XCircle,
  Search,
  FileText,
  ExternalLink,
} from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"

const ServiceList = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Home Cleaning",
      category: "Cleaning",
      price: "$50",
      status: "Pending",
      description: "Professional home cleaning services for a spotless living space.",
      providerImage: "https://randomuser.me/api/portraits/women/1.jpg",
      providerName: "Alice Johnson",
      attachedFile: "home_cleaning_details.pdf",
    },
    {
      id: 2,
      name: "Plumbing",
      category: "Maintenance",
      price: "$75",
      status: "Approved",
      description: "Expert plumbing solutions for all your household needs.",
      providerImage: "https://randomuser.me/api/portraits/men/2.jpg",
      providerName: "Bob Smith",
      attachedFile: "plumbing_services.pdf",
    },
    {
      id: 3,
      name: "Electrical Work",
      category: "Maintenance",
      price: "$80",
      status: "Rejected",
      description: "Reliable electrical services to keep your home powered and safe.",
      providerImage: "https://randomuser.me/api/portraits/women/3.jpg",
      providerName: "Carol Davis",
      attachedFile: "electrical_work_info.pdf",
    },
    {
      id: 4,
      name: "Gardening",
      category: "Outdoor",
      price: "$60",
      status: "Pending",
      description: "Professional gardening services to maintain and beautify your outdoor spaces.",
      providerImage: "https://randomuser.me/api/portraits/men/4.jpg",
      providerName: "David Wilson",
      attachedFile: "gardening_services.pdf",
    },
    {
      id: 5,
      name: "Painting",
      category: "Home Improvement",
      price: "$200",
      status: "Approved",
      description: "High-quality painting services for both interior and exterior projects.",
      providerImage: "https://randomuser.me/api/portraits/women/5.jpg",
      providerName: "Eva Brown",
      attachedFile: "painting_details.pdf",
    },
  ])

  const [selectedService, setSelectedService] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [servicesPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewingDocument, setViewingDocument] = useState(null)

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastService = currentPage * servicesPerPage
  const indexOfFirstService = indexOfLastService - servicesPerPage
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService)
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage)

  const handleDelete = (id) => {
    setServices(services.filter((service) => service.id !== id))
  }

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

  const handleApprove = (id) => {
    setServices(services.map((service) => (service.id === id ? { ...service, status: "Approved" } : service)))
    closeServiceDetails()
  }

  const handleReject = (id) => {
    setServices(services.map((service) => (service.id === id ? { ...service, status: "Rejected" } : service)))
    closeServiceDetails()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200"
      case "Rejected":
        return "bg-rose-100 text-rose-700 border border-rose-200"
      default:
        return "bg-amber-100 text-amber-700 border border-amber-200"
    }
  }

  const getStatusBgColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-600"
      case "Rejected":
        return "bg-rose-600"
      default:
        return "bg-amber-500"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "Cleaning":
        return "bg-indigo-100 text-indigo-700 border border-indigo-200"
      case "Maintenance":
        return "bg-violet-100 text-violet-700 border border-violet-200"
      case "Outdoor":
        return "bg-teal-100 text-teal-700 border border-teal-200"
      case "Home Improvement":
        return "bg-orange-100 text-orange-700 border border-orange-200"
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200"
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Service Verification</h1>
        <p className="mt-2 text-lg text-gray-600">Review and manage service provider submissions</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search services, providers, or categories..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Filter by:</span>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{service.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-full ${getCategoryColor(service.category)}`}
                    >
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{service.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-full ${getStatusColor(
                        service.status,
                      )}`}
                    >
                      {service.status === "Approved" && <CheckCircle size={14} className="mr-1" />}
                      {service.status === "Rejected" && <XCircle size={14} className="mr-1" />}
                      {service.status === "Pending" && (
                        <div className="w-2 h-2 rounded-full bg-amber-400 mr-1.5 mt-0.5" />
                      )}
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-9 w-9 rounded-full mr-3 border-2 border-white shadow-sm"
                        src={service.providerImage || "/placeholder.svg"}
                        alt={service.providerName}
                      />
                      <span className="font-medium text-gray-700">{service.providerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openServiceDetails(service)}
                        className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openDocumentViewer(service.attachedFile)}
                        className="p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                        title="View document"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                        title="Delete service"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">No services found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-600">
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
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="relative">
              <div className={`absolute inset-0 h-24 ${getStatusBgColor(selectedService.status)} opacity-90`}></div>
              <div className="relative px-6 py-4 flex justify-between items-center z-10">
                <h3 className="text-xl font-bold text-white drop-shadow-sm">{selectedService.name}</h3>
                <button
                  onClick={closeServiceDetails}
                  className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <img
                  className="h-16 w-16 rounded-full mr-4 border-2 border-white shadow-sm"
                  src={selectedService.providerImage || "/placeholder.svg"}
                  alt={selectedService.providerName}
                />
                <div>
                  <p className="text-lg font-bold text-gray-800">{selectedService.providerName}</p>
                  <p className="text-sm text-gray-500">Service Provider</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Category</p>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full ${getCategoryColor(selectedService.category)}`}
                    >
                      {selectedService.category}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Price</p>
                  <p className="text-xl font-bold text-gray-800">{selectedService.price}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Status</p>
                  <span
                    className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full ${getStatusColor(
                      selectedService.status,
                    )}`}
                  >
                    {selectedService.status === "Approved" && <CheckCircle size={16} className="mr-1.5" />}
                    {selectedService.status === "Rejected" && <XCircle size={16} className="mr-1.5" />}
                    {selectedService.status === "Pending" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-2 mt-0.5" />
                    )}
                    {selectedService.status}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Document</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => openDocumentViewer(selectedService.attachedFile)}
                      className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors border border-purple-200"
                    >
                      <FileText size={16} className="mr-1.5" />
                      View
                    </button>
                    <a
                      href={`/files/${selectedService.attachedFile}`}
                      download
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors border border-indigo-200"
                    >
                      <Download size={16} className="mr-1.5" />
                      Download
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Description</p>
                <p className="text-gray-700 leading-relaxed">{selectedService.description}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-4 px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <button
                onClick={() => handleReject(selectedService.id)}
                disabled={selectedService.status === "Rejected"}
                className="inline-flex items-center px-4 py-2 bg-white text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <XCircle size={18} className="mr-2" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedService.id)}
                disabled={selectedService.status === "Approved"}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <CheckCircle size={18} className="mr-2" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col h-[85vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FileText size={20} className="inline mr-2 text-purple-600" />
                {viewingDocument}
              </h3>
              <div className="flex items-center space-x-2">
                <a
                  href={`/files/${viewingDocument}`}
                  download
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Download document"
                >
                  <Download size={20} className="text-gray-600" />
                </a>
                <a
                  href={`/files/${viewingDocument}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink size={20} className="text-gray-600" />
                </a>
                <button
                  onClick={closeDocumentViewer}
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
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
                  <div className="w-24 h-32 mx-auto bg-gradient-to-b from-purple-50 to-indigo-50 rounded-lg border border-gray-200 flex items-center justify-center mb-4 relative shadow-md">
                    <FileText size={36} className="text-purple-600" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold text-purple-700">PDF</span>
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
                      className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium shadow-sm"
                    >
                      <Download size={18} className="mr-2" />
                      Download Document
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default ServiceList

