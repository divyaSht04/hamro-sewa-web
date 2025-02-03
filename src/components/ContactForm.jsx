import React, { useState } from 'react';
import { Send } from 'lucide-react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800" data-aos="fade-up">Contact Us</h2>
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden" data-aos="fade-up" data-aos-delay="200">
          <div className="md:flex">
            <div className="md:w-1/2 bg-primary text-white p-8">
              <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
              <p className="mb-4">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              <ul className="space-y-2">
                <li>📍 123 Service Street, City, Country</li>
                <li>📞 +1 234 567 8900</li>
                <li>✉️ info@hamrosewa.com</li>
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="md:w-1/2 p-8">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300 flex items-center justify-center">
                <Send size={20} className="mr-2" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;

