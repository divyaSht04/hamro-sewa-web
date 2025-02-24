"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, ChevronDown, Bell, Settings, LogOut } from "lucide-react"
import { useAuth } from "../auth/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout, isAuthenticated, isServiceProvider, isAdmin } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ]

  const authItems = isAuthenticated
    ? [
        ...(isServiceProvider
          ? [
              { name: "Dashboard", path: "/provider/dashboard" },
              { name: "My Services", path: "/provider/services" },
            ]
          : []),
        ...(isAdmin
          ? [
              { name: "Admin Dashboard", path: "/admin" },
              { name: "Manage Services", path: "/admin/services" },
            ]
          : []),
      ]
    : []

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-gray-900/95 shadow-lg backdrop-blur-sm" : "bg-white"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img className="h-8 w-auto" src="/logo.png" alt="Hamro Sewa Logo" />
              <span className={`text-xl font-bold ${isScrolled ? "text-white" : "text-purple-600"}`}>Hamro Sewa</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200
                    ${
                      isActive(item.path)
                        ? isScrolled
                          ? "text-purple-400"
                          : "text-purple-600"
                        : isScrolled
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-600 hover:text-purple-600"
                    }
                  `}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        isScrolled ? "bg-purple-400" : "bg-purple-600"
                      }`}
                      initial={false}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* Notifications Button */}
                  <button
                    className={`p-2 rounded-full transition-colors duration-200 relative
                      ${isScrolled ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
                  >
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-200
                        ${
                          isScrolled
                            ? "bg-white/10 hover:bg-white/20 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="text-sm font-medium">{user?.username || "User"}</span>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100"
                        >
                          <Link
                            to="/customer/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <User size={16} className="mr-2" />
                            Profile
                          </Link>
                          <Link
                            to="/customer/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Settings size={16} className="mr-2" />
                            Settings
                          </Link>
                          <button
                            onClick={logout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut size={16} className="mr-2" />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 
                      ${isScrolled ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 
                      ${
                        isScrolled
                          ? "bg-white text-gray-900 hover:bg-gray-100"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-200 
                ${isScrolled ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="container mx-auto px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 text-base font-medium rounded-lg transition-colors duration-200
                      ${isActive(item.path) ? "bg-purple-50 text-purple-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {item.name}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center px-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold mr-3">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user?.username || "User"}</div>
                        <div className="text-sm text-gray-500">{user?.email || ""}</div>
                      </div>
                    </div>

                    <Link
                      to="/customer/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/customer/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2 text-base font-medium text-center text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2 text-base font-medium text-center text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}

export default Header

  