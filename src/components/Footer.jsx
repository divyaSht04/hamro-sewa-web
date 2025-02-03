import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Hamro Sewa</h3>
            <p className="mb-4 text-gray-300">Providing modern and efficient services for all your needs.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-300">Services</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors duration-300">Blog</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-300">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services/cleaning" className="text-gray-300 hover:text-white transition-colors duration-300">Cleaning</Link></li>
              <li><Link to="/services/plumbing" className="text-gray-300 hover:text-white transition-colors duration-300">Plumbing</Link></li>
              <li><Link to="/services/electrical" className="text-gray-300 hover:text-white transition-colors duration-300">Electrical Work</Link></li>
              <li><Link to="/services/painting" className="text-gray-300 hover:text-white transition-colors duration-300">Painting</Link></li>
              <li><Link to="/services/gardening" className="text-gray-300 hover:text-white transition-colors duration-300">Gardening</Link></li>
              <li><Link to="/services/carpentry" className="text-gray-300 hover:text-white transition-colors duration-300">Carpentry</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="mb-4 text-gray-300">Stay updated with our latest news and offers.</p>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-l-md focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-md transition-colors duration-300"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Hamro Sewa. All rights reserved.</p>
          <div className="mt-2">
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link to="/terms-of-service" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

