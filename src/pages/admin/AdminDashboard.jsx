import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Users,
  Briefcase,
  DollarSign,
  Star,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"

const StatCard = ({ title, value, icon: Icon, change, changeType, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className={`flex items-center ${changeType === "increase" ? "text-green-500" : "text-red-500"}`}>
        {changeType === "increase" ? <ArrowUp size={20} className="mr-1" /> : <ArrowDown size={20} className="mr-1" />}
        <span>{change}%</span>
      </div>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
)

const RecentActivity = ({ type, message, time, status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="flex items-center py-3">
      <div className="mr-4">{getStatusIcon()}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  const [recentActivities] = useState([
    {
      type: "service",
      message: "New service request from Alice Johnson",
      time: "5 minutes ago",
      status: "pending",
    },
    {
      type: "approval",
      message: "Approved plumbing service by Bob Smith",
      time: "30 minutes ago",
      status: "completed",
    },
    {
      type: "rejection",
      message: "Rejected invalid service request",
      time: "1 hour ago",
      status: "rejected",
    },
    {
      type: "service",
      message: "New gardening service request",
      time: "2 hours ago",
      status: "pending",
    },
  ])

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      change: "12",
      changeType: "increase",
      color: "bg-[#3366FF]",
    },
    {
      title: "Active Services",
      value: "56",
      icon: Briefcase,
      change: "8",
      changeType: "increase",
      color: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: "$12,345",
      icon: DollarSign,
      change: "5",
      changeType: "decrease",
      color: "bg-yellow-500",
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      icon: Star,
      change: "2",
      changeType: "increase",
      color: "bg-purple-500",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity, index) => (
                <RecentActivity key={index} {...activity} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/services"
                className="flex items-center justify-center p-4 bg-blue-50 text-[#3366FF] rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Manage Services
              </Link>
              <Link
                to="/admin/profile"
                className="flex items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Users className="w-5 h-5 mr-2" />
                View Profile
              </Link>
              <button className="flex items-center justify-center p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                <DollarSign className="w-5 h-5 mr-2" />
                View Revenue
              </button>
              <button className="flex items-center justify-center p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors">
                <Star className="w-5 h-5 mr-2" />
                View Ratings
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard

