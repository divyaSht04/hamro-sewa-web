import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Clock, DollarSign, Trash2, Zap, Flower2, PaintBucket, Home, Building2, Sofa, Bug, Grid } from 'lucide-react';

const services = [
  { id: 1, name: 'Home Cleaning', category: 'Cleaning', provider: 'CleanCo', description: 'Professional home cleaning services', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', rating: 4.8, duration: '2-3 hours', price: '$50-$100', icon: Home },
  { id: 2, name: 'Office Cleaning', category: 'Cleaning', provider: 'OfficeSpark', description: 'Comprehensive office cleaning solutions', image: 'https://images.unsplash.com/photo-1613385102957-e1c98359ba17?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', rating: 4.7, duration: '3-4 hours', price: '$100-$200', icon: Building2 },
  { id: 3, name: 'Plumbing', category: 'Maintenance', provider: 'FixIt Plumbers', description: 'Expert plumbing services for your home', image: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', rating: 4.9, duration: '1-2 hours', price: '$75-$150', icon: Trash2 },
  { id: 4, name: 'Electrical Work', category: 'Maintenance', provider: 'Volt Masters', description: 'Professional electrical services', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', rating: 4.8, duration: '1-3 hours', price: '$80-$200', icon: Zap },
  { id: 5, name: 'Gardening', category: 'Outdoor', provider: 'Green Thumb', description: 'Expert gardening and landscaping services', image: 'https://images.unsplash.com/photo-1599629954294-14df9ec8dfe8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', rating: 4.6, duration: '2-4 hours', price: '$60-$120', icon: Flower2 },
  { id: 6, name: 'Interior Painting', category: 'Painting', provider: 'ColorWorks', description: 'Professional interior painting services', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', rating: 4.7, duration: '4-8 hours', price: '$200-$500', icon: PaintBucket },
  { id: 7, name: 'Exterior Painting', category: 'Painting', provider: 'FreshCoat Pros', description: 'Expert exterior painting services', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', rating: 4.8, duration: '1-3 days', price: '$500-$2000', icon: PaintBucket },
  { id: 8, name: 'Decorative Painting', category: 'Painting', provider: 'ArtBrush Decor', description: 'Creative decorative painting solutions', image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', rating: 4.9, duration: '1-5 days', price: '$300-$1500', icon: PaintBucket },
  { id: 9, name: 'Furniture Assembly', category: 'Home Improvement', provider: 'AssembleEase', description: 'Expert furniture assembly service', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', rating: 4.6, duration: '1-4 hours', price: '$50-$150', icon: Sofa },
  { id: 10, name: 'Pest Control', category: 'Maintenance', provider: 'BugBusters', description: 'Effective pest control solutions', image: 'https://images.unsplash.com/photo-1611274757139-82be3bb5d7b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', rating: 4.9, duration: '1-2 hours', price: '$100-$200', icon: Bug },
];

const categories = ['All', ...new Set(services.map(service => service.category))];

export default function ServicePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);

  useEffect(() => {
    const filtered = services.filter(service => 
      (selectedCategory === 'All' || service.category === selectedCategory) &&
      (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       service.provider.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredServices(filtered);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-10"> Services </h1> 
       <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search services or providers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto max-h-[calc(100vh-300px)]">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
              <AnimatePresence>
                {categories.map(category => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className={`p-4 rounded-md cursor-pointer mb-3 ${
                        selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'
                      } transition-colors duration-200`}
                      onClick={() => setSelectedCategory(category)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        {category === 'All' && <Grid className="w-6 h-6 mr-3" />}
                        {category === 'Cleaning' && <Home className="w-6 h-6 mr-3" />}
                        {category === 'Maintenance' && <Trash2 className="w-6 h-6 mr-3" />}
                        {category === 'Outdoor' && <Flower2 className="w-6 h-6 mr-3" />}
                        {category === 'Painting' && <PaintBucket className="w-6 h-6 mr-3" />}
                        {category === 'Home Improvement' && <Sofa className="w-6 h-6 mr-3" />}
                        <h3 className="font-semibold">{category}</h3>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
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
                  {selectedCategory === 'All' ? 'All Services' : `${selectedCategory} Services`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredServices.map(service => (
                    <div key={service.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="relative h-48 mb-4 rounded-md overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <service.icon className="w-16 h-16 text-white opacity-75" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">Provider: {service.provider}</p>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <div className="flex items-center mb-4 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-semibold mr-2">{service.rating}</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-gray-600 mr-4">{service.duration}</span>
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="text-gray-600">{service.price}</span>
                      </div>
                      <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors duration-300">
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

