import { useState } from "react"
import { Trash2, Eye, X, ChevronLeft, ChevronRight, Download, CheckCircle, XCircle, Search } from "lucide-react"
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

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.providerName.toLowerCase().includes(searchTerm.toLowerCase()),
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
        return "bg-green-100 text-green-600"
      case "Rejected":
        return "bg-red-100 text-red-600"
      default:
        return "bg-yellow-100 text-yellow-600"
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Service List</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services or providers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{service.name}</td>
                  <td className="px-6 py-4">{service.category}</td>
                  <td className="px-6 py-4">{service.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        service.status,
                      )}`}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full mr-3"
                        src={service.providerImage || "/placeholder.svg"}
                        alt={service.providerName}
                      />
                      <span>{service.providerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openServiceDetails(service)}
                        className="text-[#3366FF] hover:text-blue-700"
                      >
                        <Eye size={20} />
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">{selectedService.name}</h3>
              <button onClick={closeServiceDetails} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center">
                <img
                  className="h-16 w-16 rounded-full mr-4"
                  src={selectedService.providerImage || "/placeholder.svg"}
                  alt={selectedService.providerName}
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">{selectedService.providerName}</p>
                  <p className="text-sm text-gray-500">Service Provider</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="mt-1">{selectedService.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="mt-1">{selectedService.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span
                    className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedService.status,
                    )}`}
                  >
                    {selectedService.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Attached File</p>
                  <a
                    href={`/files/${selectedService.attachedFile}`}
                    download
                    className="inline-flex items-center mt-1 text-[#3366FF] hover:text-blue-700"
                  >
                    <Download size={16} className="mr-1" />
                    {selectedService.attachedFile}
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1 text-gray-600">{selectedService.description}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-4 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => handleApprove(selectedService.id)}
                disabled={selectedService.status === "Approved"}
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={18} className="mr-2" />
                Approve
              </button>
              <button
                onClick={() => handleReject(selectedService.id)}
                disabled={selectedService.status === "Rejected"}
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle size={18} className="mr-2" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default ServiceList

