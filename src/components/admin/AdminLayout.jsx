import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, List, UserCog, LogOut, Menu, X, Bell } from "lucide-react"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Services", path: "/admin/services", icon: List },
    { name: "Profile", path: "/admin/profile", icon: UserCog },
  ]

  return (
    <div
      className={`bg-[#3366FF] text-white h-full fixed left-0 top-0 z-40 w-64 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex items-center p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
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
        <Link
          to="/logout"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  )
}

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-600">
                <Bell size={20} />
              </button>
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Admin"
              />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout

