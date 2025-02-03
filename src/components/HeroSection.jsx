import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

function HeroSection() {
  return (
    <div className="relative bg-gray-100 overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-8">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white" data-aos="fade-up">
              Welcome to <span className="text-primary">Hamro Sewa</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300" data-aos="fade-up" data-aos-delay="200">
              Providing modern, clean, and efficient services for your everyday needs
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4" data-aos="fade-up" data-aos-delay="400">
              <Link
                to="/services"
                className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition duration-300 inline-flex items-center justify-center"
              >
                Our Services <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition duration-300 inline-flex items-center justify-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden md:block" data-aos="fade-left">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Hamro Sewa Services" 
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8" data-aos="fade-up" data-aos-delay="600">
          {['Professional Staff', 'Quality Service', 'Affordable Prices', 'Timely Delivery'].map((item, index) => (
            <div key={index} className="flex items-center justify-center md:justify-start space-x-2">
              <CheckCircle className="text-primary" size={24} />
              <span className="text-sm md:text-base font-medium text-white">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

