"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowUp,
  ArrowDown,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Calendar,
  DollarSign,
  ChevronRight,
  Users,
  Award,
  BarChart2,
  TrendingUp,
  Briefcase,
} from "lucide-react"
import ServiceProviderLayout from "../../components/serviceProvider/ServiceProviderLayout"
import { useAuth } from "../../auth/AuthContext"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

const StatCard = ({ title, value, icon: Icon, change, changeType, color, bgColor }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden`}
  >
    <div className={`${bgColor} h-2`}></div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div
            className={`flex items-center text-sm font-medium ${changeType === "increase" ? "text-green-500" : "text-red-500"}`}
          >
            {changeType === "increase" ? (
              <ArrowUp size={16} className="mr-1" />
            ) : (
              <ArrowDown size={16} className="mr-1" />
            )}
            <span>{change}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  </motion.div>
)

const RecentActivity = ({ type, message, time, status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-rose-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-all"
    >
      <div className="mr-4">{getStatusIcon()}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-800 font-medium">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </motion.div>
  )
}

export function ServiceProviderDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState([
    {
      title: "Total Services",
      value: "12",
      icon: Briefcase,
      change: "8",
      changeType: "increase",
      color: "bg-blue-500",
      bgColor: "bg-blue-500",
    },
    {
      title: "Active Orders",
      value: "4",
      icon: Clock,
      change: "12",
      changeType: "increase",
      color: "bg-amber-500",
      bgColor: "bg-amber-500",
    },
    {
      title: "Monthly Revenue",
      value: "$1,240",
      icon: DollarSign,
      change: "5",
      changeType: "increase",
      color: "bg-green-500",
      bgColor: "bg-green-500",
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: Star,
      change: "2",
      changeType: "increase",
      color: "bg-purple-500",
      bgColor: "bg-purple-500",
    },
  ])

  const [recentActivities, setRecentActivities] = useState([
    {
      type: "service",
      message: "New booking request from John Smith for Plumbing Service",
      time: "10 minutes ago",
      status: "pending",
    },
    {
      type: "approval",
      message: "Your Electrical Service has been approved",
      time: "2 hours ago",
      status: "completed",
    },
    {
      type: "rejection",
      message: "Your Landscaping Service has been rejected. Please update and resubmit.",
      time: "Yesterday",
      status: "rejected",
    },
    {
      type: "review",
      message: "You received a 5-star review from Maria Johnson",
      time: "2 days ago",
      status: "completed",
    },
  ])

  const [performanceData, setPerformanceData] = useState({
    totalClients: "38",
    completedJobs: "26",
    totalEarnings: "$3,840",
    responseRate: "94%",
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, these would be API calls
        // const statsResponse = await api.get("/provider/stats")
        // setStats(statsResponse.data)
        // const activitiesResponse = await api.get("/provider/recent-activities")
        // setRecentActivities(activitiesResponse.data)
        // const performanceResponse = await api.get("/provider/performance")
        // setPerformanceData(performanceResponse.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <ServiceProviderLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.username || "Provider"}!</h1>
              <p className="mt-2 text-green-50">
                You have <span className="font-semibold">4 active</span> service requests and{" "}
                <span className="font-semibold">2 pending</span> approvals
              </p>
            </div>
            <Link
              to="/provider/services/new"
              className="mt-4 md:mt-0 bg-white text-green-600 px-4 py-2 rounded-lg font-medium flex items-center hover:bg-green-50 transition-colors shadow-sm"
            >
              <PlusCircle size={18} className="mr-2" />
              Add New Service
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                <Link to="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View All <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-4 divide-y divide-gray-50">
              {recentActivities.map((activity, index) => (
                <RecentActivity key={index} {...activity} />
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Performance Metrics</h2>
            </div>
            <div className="p-6 space-y-6">
              <PerformanceMetric
                icon={<Users className="w-5 h-5 text-blue-500" />}
                label="Total Clients"
                value={performanceData.totalClients}
              />
              <PerformanceMetric
                icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                label="Completed Jobs"
                value={performanceData.completedJobs}
              />
              <PerformanceMetric
                icon={<DollarSign className="w-5 h-5 text-amber-500" />}
                label="Total Earnings"
                value={performanceData.totalEarnings}
              />
              <PerformanceMetric
                icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
                label="Response Rate"
                value={performanceData.responseRate}
              />

              <Link
                to="/provider/analytics"
                className="mt-4 flex justify-center items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <BarChart2 size={16} className="mr-2" />
                View detailed analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard
              icon={<PlusCircle className="w-6 h-6 text-white" />}
              title="Add Service"
              href="/provider/services/new"
              color="bg-blue-500"
            />
            <QuickActionCard
              icon={<Briefcase className="w-6 h-6 text-white" />}
              title="My Services"
              href="/provider/services"
              color="bg-green-500"
            />
            <QuickActionCard
              icon={<Calendar className="w-6 h-6 text-white" />}
              title="Bookings"
              href="/provider/bookings"
              color="bg-amber-500"
            />
            <QuickActionCard
              icon={<Award className="w-6 h-6 text-white" />}
              title="Reviews"
              href="/provider/reviews"
              color="bg-purple-500"
            />
          </div>
        </div>
      </div>
    </ServiceProviderLayout>
  )
}

const PerformanceMetric = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="mr-4 p-3 bg-gray-50 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
)

const QuickActionCard = ({ icon, title, href, color }) => (
  <Link
    to={href}
    className="flex flex-col items-center bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300"
  >
    <span className={`p-3 rounded-full ${color} mb-3`}>{icon}</span>
    <span className="text-sm font-medium text-gray-700">{title}</span>
  </Link>
)