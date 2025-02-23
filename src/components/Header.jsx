import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User } from "lucide-react"
import { useAuth } from "../auth/AuthContext"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { user, logout, isAuthenticated, isServiceProvider, isAdmin } = useAuth()

   useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

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
        { name: "Edit Profile", path: "/edit-profile" },
        { name: "Logout", onClick: logout },
      ]
    : [
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
      ]

  return (
    <>
      <header
        className={`fixed w-full z-10 transition-all duration-300 ${
          isScrolled ? "bg-gray-900 shadow-lg" : "bg-white/95"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src="/logo.png" alt="Hamro Sewa Logo" />
              <span className={`ml-2 text-xl font-bold ${isScrolled ? "text-white" : "text-purple-600"}`}>
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
                      ? "text-purple-500"
                      : isScrolled
                        ? "text-white hover:text-purple-300"
                        : "text-gray-800 hover:text-purple-600"
                  } transition-colors duration-200`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-sm bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200">
                    <User size={16} />
                    <span>{user.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                    {authItems.map((item, index) =>
                      item.onClick ? (
                        <button
                          key={index}
                          onClick={item.onClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          key={index}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden">
              <button
                type="button"
                className={`${isScrolled ? "text-white" : "text-gray-800"} hover:text-purple-600 focus:outline-none`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-gray-900 bg-opacity-90 backdrop-blur-sm">
          <div className="flex flex-col h-full justify-center items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-white text-2xl font-medium py-4 hover:text-purple-300 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {authItems.map((item, index) =>
              item.onClick ? (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick()
                    setIsMenuOpen(false)
                  }}
                  className="text-white text-2xl font-medium py-4 hover:text-purple-300 transition-colors duration-200"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className="text-white text-2xl font-medium py-4 hover:text-purple-300 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ),
            )}
          </div>
        </div>
      )}

      {/* Minimal spacer - only as tall as the header */}
      <div className="h-16"></div>
    </>
  )
}

export default Header