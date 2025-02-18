import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Phone, Mail } from 'lucide-react';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-white/95'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/"
                alt="Hamro Sewa Logo"
              />
              <span className={`ml-2 text-xl font-bold ${isScrolled ? 'text-white' : 'text-purple-600'}`}>
                Hamro Sewa
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-base font-medium ${
                    isActive(item.path)
                      ? 'text-purple-500'
                      : isScrolled
                      ? 'text-white hover:text-purple-300'
                      : 'text-gray-800 hover:text-purple-600'
                  } transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <a href="tel:+977-9841930222" className={`text-sm ${isScrolled ? 'text-white' : 'text-gray-800'}`}>
                <Phone size={16} className="inline mr-1" />
                +977 9841930222
              </a>
              <a href="mailto:hamrosewa2004@gmail.com" className={`text-sm ${isScrolled ? 'text-white' : 'text-gray-800'}`}>
                <Mail size={16} className="inline mr-1" />
                hamrosewa2004@gmail.com
              </a>
              <Link
                to="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
              >https://divyaSht04@github.com
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

  
    </>
  );  
}

export default Header;

