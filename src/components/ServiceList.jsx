import React from 'react';
import { Home, Wrench, Zap, Flower2, PaintBucket, Hammer } from 'lucide-react';

const services = [
  { title: 'Home Cleaning', description: 'Professional cleaning services for your home', icon: <Home size={40} />, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
  { title: 'Plumbing', description: 'Expert plumbing solutions for any issue', icon: <Wrench size={40} />, image: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
  { title: 'Electrical Work', description: 'Skilled electricians for all your needs', icon: <Zap size={40} />, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
  { title: 'Gardening', description: 'Keep your garden beautiful and healthy', icon: <Flower2 size={40} />, image: 'https://images.unsplash.com/photo-1599629954294-14df9ec8dfe8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
  { title: 'Painting', description: 'Transform your space with our painting services', icon: <PaintBucket size={40} />, image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
  { title: 'Carpentry', description: 'Custom woodwork and furniture solutions', icon: <Hammer size={40} />, image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' },
];

function ServicesList() {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800" data-aos="fade-up">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl group" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-4xl">{service.icon}</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <button className="mt-4 text-primary hover:text-primary-dark transition-colors duration-300">Learn More →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesList;

