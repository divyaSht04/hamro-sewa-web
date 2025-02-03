import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award, CheckCircle, Clock, Zap, Heart, Shield } from 'lucide-react';

export default function AboutUsPage() {
  const features = [
    { icon: <Users size={40} />, title: 'Our Vision', description: 'To revolutionize the service industry through technology and innovation, making quality services accessible to all.' },
    { icon: <Target size={40} />, title: 'Our Mission', description: 'Delivering exceptional services that simplify lives and exceed expectations, while empowering local service providers.' },
    { icon: <Award size={40} />, title: 'Our Values', description: 'Integrity, excellence, and customer satisfaction guide everything we do, fostering trust and long-lasting relationships.' },
  ];

  const timeline = [
    { year: '2015', event: 'Hamro Sewa founded by a group of passionate entrepreneurs' },
    { year: '2017', event: 'Expanded services to cover major cities across the country' },
    { year: '2019', event: 'Launched mobile app for easier booking and management' },
    { year: '2021', event: 'Introduced eco-friendly service options' },
    { year: '2023', event: 'Reached milestone of 1 million satisfied customers' },
  ];

  const stats = [
    { value: '50,000+', label: 'Service Providers' },
    { value: '1M+', label: 'Satisfied Customers' },
    { value: '100+', label: 'Cities Covered' },
    { value: '4.8/5', label: 'Average Rating' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-center mb-6"
          >
            About Hamro Sewa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-center max-w-3xl mx-auto"
          >
            Connecting quality service providers with customers since 2015. We're on a mission to simplify your life, one service at a time.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-100 clip-path-slant"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-3xl font-semibold mb-4 text-gray-800">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Hamro Sewa was born from a simple yet powerful idea: to make everyday services accessible, reliable, and hassle-free for everyone. Our journey began in 2015 when a group of passionate entrepreneurs recognized the need for a platform that could bridge the gap between skilled service providers and customers seeking quality services.
              </p>
              <p className="text-gray-600">
                Since then, we've grown from a small startup to a trusted name in the service industry, connecting thousands of skilled professionals with customers across the country. Our commitment to quality, innovation, and customer satisfaction has been the driving force behind our success.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex justify-center"
            >
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Hamro Sewa Team" 
                className="rounded-lg shadow-xl w-full max-w-md h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values Section */}
      <section className="bg-gray-200 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">Our Foundation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-xl mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary"></div>
            {timeline.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'md:text-left md:pl-8' : 'text-right pr-8'}`}>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg text-primary">{item.year}</h3>
                    <p className="text-gray-600">{item.event}</p>
                  </div>
                </div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                </div>
                <div className="w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">Hamro Sewa in Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">Why Choose Hamro Sewa?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <CheckCircle size={40} />, title: 'Vetted Professionals', description: 'All our service providers undergo thorough background checks and skill assessments.' },
              { icon: <Clock size={40} />, title: 'Timely Service', description: 'We value your time and ensure punctual service delivery.' },
              { icon: <Zap size={40} />, title: 'Instant Booking', description: 'Book services with just a few taps on our user-friendly platform.' },
              { icon: <Heart size={40} />, title: 'Customer Satisfaction', description: 'Your satisfaction is our top priority, backed by our service guarantee.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="text-primary mb-4 flex justify-center">{item.icon}</div>
                <h3 className="font-semibold text-xl mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-200 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Ready to Experience Hamro Sewa?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of satisfied customers and simplify your life today.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-primary-dark transition-colors duration-300"
          >
            Book a Service Now
          </motion.button>
        </div>
      </section>
    </div>
  );
}

