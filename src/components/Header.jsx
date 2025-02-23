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
                <>
                  <div className="relative group">
                    <button 
                      className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-md transition-colors duration-200 ${
                        isScrolled 
                          ? "bg-gray-700 text-white hover:bg-gray-600" 
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      <User size={16} />
                      <span>{user?.username || 'User'}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                      {authItems.filter(item => item.name !== 'Logout').map((item, index) =>
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
                        )
                      )}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className={`text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 ${
                      isScrolled
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 ${
                      isScrolled
                        ? "bg-purple-500 text-white hover:bg-purple-600"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`text-sm font-medium px-4 py-2 rounded-md border transition-colors duration-200 ${
                      isScrolled
                        ? "border-purple-500 text-white hover:bg-purple-500"
                        : "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
                    }`}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${
                  isScrolled ? "text-white" : "text-gray-800"
                }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "bg-purple-500 text-white"
                    : "text-gray-800 hover:bg-purple-50 hover:text-purple-500"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">
                    Signed in as {user?.username || 'User'}
                  </div>
                  {authItems.filter(item => item.name !== 'Logout').map((item, index) =>
                    item.onClick ? (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-500"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-500"
                      >
                        {item.name}
                      </Link>
                    )
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 mt-2 text-base font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-white bg-purple-500 hover:bg-purple-600 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 mt-2 text-base font-medium text-purple-500 border border-purple-500 hover:bg-purple-500 hover:text-white rounded-md"
                >
                  Register
                </Link>
              </div>
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