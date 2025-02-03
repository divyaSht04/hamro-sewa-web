import React, { useState } from 'react';
import { Trash2, Eye, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const ServiceList = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Home Cleaning', category: 'Cleaning', price: '$50', description: 'Professional home cleaning services for a spotless living space.', providerImage: 'https://randomuser.me/api/portraits/women/1.jpg', providerName: 'Alice Johnson', attachedFile: 'home_cleaning_details.pdf' },
    { id: 2, name: 'Plumbing', category: 'Maintenance', price: '$75', description: 'Expert plumbing solutions for all your household needs.', providerImage: 'https://randomuser.me/api/portraits/men/2.jpg', providerName: 'Bob Smith', attachedFile: 'plumbing_services.pdf' },
    { id: 3, name: 'Electrical Work', category: 'Maintenance', price: '$80', description: 'Reliable electrical services to keep your home powered and safe.', providerImage: 'https://randomuser.me/api/portraits/women/3.jpg', providerName: 'Carol Davis', attachedFile: 'electrical_work_info.pdf' },
    { id: 4, name: 'Gardening', category: 'Outdoor', price: '$60', description: 'Professional gardening services to maintain and beautify your outdoor spaces.', providerImage: 'https://randomuser.me/api/portraits/men/4.jpg', providerName: 'David Wilson', attachedFile: 'gardening_services.pdf' },
    { id: 5, name: 'Painting', category: 'Home Improvement', price: '$200', description: 'High-quality painting services for both interior and exterior projects.', providerImage: 'https://randomuser.me/api/portraits/women/5.jpg', providerName: 'Eva Brown', attachedFile: 'painting_details.pdf' },
    { id: 6, name: 'Carpet Cleaning', category: 'Cleaning', price: '$100', description: 'Deep carpet cleaning for a fresher, cleaner home.', providerImage: 'https://randomuser.me/api/portraits/men/6.jpg', providerName: 'Frank Miller', attachedFile: 'carpet_cleaning_info.pdf' },
    { id: 7, name: 'Pest Control', category: 'Maintenance', price: '$120', description: 'Effective pest control solutions for a bug-free environment.', providerImage: 'https://randomuser.me/api/portraits/women/7.jpg', providerName: 'Grace Lee', attachedFile: 'pest_control_services.pdf' },
    { id: 8, name: 'Appliance Repair', category: 'Maintenance', price: '$90', description: 'Expert repair services for all your household appliances.', providerImage: 'https://randomuser.me/api/portraits/men/8.jpg', providerName: 'Henry Taylor', attachedFile: 'appliance_repair_details.pdf' },
    { id: 9, name: 'Window Cleaning', category: 'Cleaning', price: '$70', description: 'Professional window cleaning for a crystal-clear view.', providerImage: 'https://randomuser.me/api/portraits/women/9.jpg', providerName: 'Irene Clark', attachedFile: 'window_cleaning_info.pdf' },
    { id: 10, name: 'Furniture Assembly', category: 'Home Improvement', price: '$85', description: 'Skilled furniture assembly services for your convenience.', providerImage: 'https://randomuser.me/api/portraits/men/10.jpg', providerName: 'Jack Anderson', attachedFile: 'furniture_assembly_services.pdf' },
  ]);

  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(5);

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  const totalPages = Math.ceil(services.length / servicesPerPage);

  const handleDelete = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  const openServiceDetails = (service) => {
    setSelectedService(service);
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Service List</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentServices.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{service.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{service.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full mr-2" src={service.providerImage} alt={service.providerName} />
                      {service.providerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => openServiceDetails(service)}
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {selectedService && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-medium text-gray-900">{selectedService.name}</h3>
              <button
                onClick={closeServiceDetails}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mt-2 space-y-4">
              <div className="flex items-center">
                <img className="h-16 w-16 rounded-full mr-4" src={selectedService.providerImage} alt={selectedService.providerName} />
                <div>
                  <p className="text-lg font-semibold">{selectedService.providerName}</p>
                  <p className="text-sm text-gray-500">Service Provider</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                <strong>Category:</strong> {selectedService.category}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Price:</strong> {selectedService.price}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Description:</strong> {selectedService.description}
              </p>
              <div className="flex items-center">
                <strong className="mr-2">Attached File:</strong>
                <a
                  href={`/files/${selectedService.attachedFile}`}
                  download
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Download size={20} className="mr-1" />
                  {selectedService.attachedFile}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ServiceList;

