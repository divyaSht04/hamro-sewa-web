import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, List, UserCog, LogOut, Menu, X, Bell } from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import toast from "react-hot-toast"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const navItems = [
    { name: "Dashboard", path: "/provider", icon: LayoutDashboard },
    { name: "My Services", path: "/provider/services", icon: List },
    { name: "Profile", path: "/provider/profile", icon: UserCog },
  ]

  return (
    <div
      className={`bg-[#4CAF50] text-white h-full fixed left-0 top-0 z-40 w-64 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex items-center p-6">
        <h1 className="text-2xl font-bold">Provider Panel</h1>
        <button onClick={toggleSidebar} className="md:hidden ml-auto">
          <X size={24} />
        </button>
      </div>
      <nav className="mt-6">
        <ul className="space-y-1 px-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path) ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

const ServiceProviderLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
//   const { user } = useAuth()

  const user = {
    username: "John Doe",
    profileImage: "https://via.placeholder.com/32",
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 h-16">
            <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-600">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Service Provider Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-600">
                <Bell size={20} />
              </button>
              <img
                className="h-8 w-8 rounded-full"
                src={user.profileImage || "https://via.placeholder.com/32"}
                alt={user.username}
              />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

export default ServiceProviderLayout
