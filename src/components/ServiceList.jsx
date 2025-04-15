import React, { useState, useEffect } from 'react';
import { parseDate } from '../utils/dateUtils';
import { Home, Wrench, Zap, Flower2, PaintBucket, Hammer, ServerOff, Info } from 'lucide-react';
import { getApprovedServices, getServiceImageUrl } from '../services/providerServiceApi';
import { Link } from 'react-router-dom';

// Default icons based on category
const categoryIcons = {
  'Home Cleaning': <Home size={40} />,
  'Plumbing': <Wrench size={40} />,
  'Electrical': <Zap size={40} />,
  'Gardening': <Flower2 size={40} />,
  'Painting': <PaintBucket size={40} />,
  'Carpentry': <Hammer size={40} />,
  'default': <Wrench size={40} /> // Default icon
};

// Fallback image if service image is not available
const fallbackImages = {
  'Home Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'Plumbing': 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'Electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'Gardening': 'https://images.unsplash.com/photo-1599629954294-14df9ec8dfe8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'Painting': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'Carpentry': 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'default': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
};

function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedServices = async () => {
      try {
        setLoading(true);
        const data = await getApprovedServices();
        setServices(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching approved services:', err);
        setError('Unable to load services. The server may be down or unavailable at the moment.');
        setLoading(false);
      }
    };

    fetchApprovedServices();
  }, []);

  // Get appropriate icon based on service category
  const getIconForService = (service) => {
    return categoryIcons[service.category] || categoryIcons.default;
  };

  // Get appropriate image for service
  const getImageForService = (service) => {
    if (service.imagePath) {
      return getServiceImageUrl(service.id);
    }
    return fallbackImages[service.category] || fallbackImages.default;
  };

  if (loading) {
    return (
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">Our Services</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">Our Services</h2>
          <div className="flex flex-col items-center mb-8">
            <ServerOff size={48} className="text-red-500 mb-4" />
            <div className="text-red-500 font-semibold mb-2">Service Unavailable</div>
            <div className="text-gray-600 max-w-md">{error}</div>
            <p className="text-gray-500 mt-2">Please try again later or contact support if the problem persists.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800" data-aos="fade-up">Our Services</h2>
        
        {services.length === 0 ? (
          <div className="flex flex-col items-center text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
              <Info size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Services Available</h3>
            <p className="text-gray-600 max-w-md">There are no services available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link to={`/service-details/${service.id}`} key={service.id}>
                <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl group" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={getImageForService(service)} 
                      alt={service.serviceName} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      onError={(e) => {
                        e.target.src = fallbackImages.default;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-white text-4xl">{getIconForService(service)}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-primary transition-colors duration-300">{service.serviceName}</h3>
                  <p className="text-gray-600 line-clamp-2">{service.description}</p>
                  <div className="mt-2 text-primary font-semibold">Rs. {service.price.toFixed(2)}</div>
                  <div className="mt-1 text-sm text-gray-500">Provider: {service.serviceProvider?.name || 'Unknown'}</div>
                  <div className="mt-4 text-primary hover:text-primary-dark transition-colors duration-300">View Details →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicesList;
