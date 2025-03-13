"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaUser, FaSignOutAlt, FaHistory, FaCalendarCheck, FaBars, FaTimes } from "react-icons/fa"
import { useAuth } from "../auth/AuthContext"
import { ROLES } from "../constants/roles"
// import logo from "../assets/images/logo.png"

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path ? "text-purple-600 font-semibold" : "text-gray-700 hover:text-purple-600"
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-4"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <img src={"/placeholder.svg?height=40&width=40"} alt="HamroSewa Logo" className="h-10" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            HamroSewa
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`${isActive("/")} transition-colors duration-200`}>
            Home
          </Link>
          <Link to="/services" className={`${isActive("/services")} transition-colors duration-200`}>
            Services
          </Link>
          <Link to="/about" className={`${isActive("/about")} transition-colors duration-200`}>
            About
          </Link>
          <Link to="/contact" className={`${isActive("/contact")} transition-colors duration-200`}>
            Contact
          </Link>

          {user && user.role === ROLES.CUSTOMER && (
            <Link
              to="/customer/bookings"
              className={`${isActive("/customer/bookings")} flex items-center space-x-1 transition-colors duration-200`}
            >
              <FaHistory className="text-purple-600" />
              <span>My Bookings</span>
            </Link>
          )}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300">
                <FaUser />
                <span>{user.name || "User"}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                {user.role === ROLES.ADMIN && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    <FaUser className="text-purple-600" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                {user.role === ROLES.SERVICE_PROVIDER && (
                  <Link
                    to="/service-provider/dashboard"
                    className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    <FaUser className="text-purple-600" />
                    <span>Provider Dashboard</span>
                  </Link>
                )}

                {user.role === ROLES.CUSTOMER && (
                  <>
                    <Link
                      to="/customer/profile"
                      className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      <FaUser className="text-purple-600" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/customer/bookings"
                      className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaCalendarCheck className="text-purple-600" />
                      <span>My Bookings</span>
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-purple-600 border border-purple-600 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-full transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white z-50 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 md:hidden`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                <img src={"/placeholder.svg?height=40&width=40"} alt="HamroSewa Logo" className="h-10" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  HamroSewa
                </span>
              </Link>
              <button className="text-gray-700 focus:outline-none" onClick={toggleMenu} aria-label="Close menu">
                <FaTimes size={24} />
              </button>
            </div>

            <nav className="flex flex-col p-4 space-y-4 overflow-y-auto flex-grow">
              <Link to="/" className={`${isActive("/")} py-2 text-lg`} onClick={closeMenu}>
                Home
              </Link>
              <Link to="/services" className={`${isActive("/services")} py-2 text-lg`} onClick={closeMenu}>
                Services
              </Link>
              <Link to="/about" className={`${isActive("/about")} py-2 text-lg`} onClick={closeMenu}>
                About
              </Link>
              <Link to="/contact" className={`${isActive("/contact")} py-2 text-lg`} onClick={closeMenu}>
                Contact
              </Link>

              {user && user.role === ROLES.CUSTOMER && (
                <Link
                  to="/customer/bookings"
                  className={`${isActive("/customer/bookings")} flex items-center space-x-2 py-2 text-lg`}
                  onClick={closeMenu}
                >
                  <FaHistory className="text-purple-600" />
                  <span>My Bookings</span>
                </Link>
              )}
            </nav>

            <div className="p-4 border-t">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                    <FaUser className="text-purple-600" />
                    <span className="font-medium">{user.name || "User"}</span>
                  </div>

                  {user.role === ROLES.ADMIN && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center space-x-2 p-2 w-full text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={closeMenu}
                    >
                      <FaUser className="text-purple-600" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  {user.role === ROLES.SERVICE_PROVIDER && (
                    <Link
                      to="/service-provider/dashboard"
                      className="flex items-center space-x-2 p-2 w-full text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={closeMenu}
                    >
                      <FaUser className="text-purple-600" />
                      <span>Provider Dashboard</span>
                    </Link>
                  )}

                  {user.role === ROLES.CUSTOMER && (
                    <>
                      <Link
                        to="/customer/profile"
                        className="flex items-center space-x-2 p-2 w-full text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={closeMenu}
                      >
                        <FaUser className="text-purple-600" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/customer/bookings"
                        className="flex items-center space-x-2 p-2 w-full text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={closeMenu}
                      >
                        <FaCalendarCheck className="text-purple-600" />
                        <span>My Bookings</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      handleLogout()
                      closeMenu()
                    }}
                    className="flex items-center space-x-2 p-2 w-full text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="text-center text-purple-600 border border-purple-600 hover:bg-purple-600 hover:text-white py-2 rounded-full transition-colors duration-300"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-full hover:shadow-lg transition-all duration-300"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header