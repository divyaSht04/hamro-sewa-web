"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, ListTodo, UserCircle2, LogOut, Calendar } from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import toast from "react-hot-toast"

const Sidebar = () => {
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
    { name: "My Services", path: "/provider/services", icon: ListTodo },
    { name: "Bookings", path: "/provider/bookings", icon: Calendar },
    { name: "Profile", path: "/provider/profile", icon: UserCircle2 },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-xl font-bold">Provider Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path) ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-white/10 rounded-lg transition-colors"
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default ServiceProviderLayout