import { Link } from "react-router-dom"
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa"
// import logo from "../assets/images/logo.png"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={"/placeholder.svg?height=40&width=40"}
                // src={logo || "/placeholder.svg?height=40&width=40"}
                alt="HamroSewa Logo"
                className="h-10 bg-white rounded-full p-1"
              />
              <span className="text-xl font-bold text-white">HamroSewa</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted platform for finding and booking professional services. We connect customers with skilled
              service providers to make everyday life easier.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Services
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/register/provider"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Become a Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services?category=home-cleaning"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Home Cleaning
                </Link>
              </li>
              <li>
                <Link
                  to="/services?category=plumbing"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Plumbing
                </Link>
              </li>
              <li>
                <Link
                  to="/services?category=electrical"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Electrical
                </Link>
              </li>
              <li>
                <Link
                  to="/services?category=gardening"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Gardening
                </Link>
              </li>
              <li>
                <Link
                  to="/services?category=painting"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">›</span> Painting
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-purple-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Service Street, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-purple-400 flex-shrink-0" />
                <span className="text-gray-300">+977 9812345678</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-purple-400 flex-shrink-0" />
                <span className="text-gray-300">info@hamrosewa.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link
                to="/contact"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors duration-300 text-sm"
              >
                Send Message
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>© {currentYear} HamroSewa. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center">
            Made with <FaHeart className="text-red-500 mx-1" /> in Nepal
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer