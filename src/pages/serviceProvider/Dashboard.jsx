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
  Loader,
} from "lucide-react"
import ServiceProviderLayout from "../../components/serviceProvider/ServiceProviderLayout"
import { useAuth } from "../../auth/AuthContext"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import NotificationsWidget from "../../components/serviceProvider/NotificationsWidget"
import { 
  getDashboardMetrics, 
  getPerformanceMetrics, 
  getMonthlyEarnings,
  getClientGrowth,
  getServicePopularity 
} from "../../services/serviceProviderService"

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
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    {
      title: "Total Services",
      value: "0",
      icon: Briefcase,
      change: "0",
      changeType: "increase",
      color: "bg-blue-500",
      bgColor: "bg-blue-500",
    },
    {
      title: "Total Revenue",
      value: "Rs. 0",
      icon: DollarSign,
      change: "0",
      changeType: "increase",
      color: "bg-green-500",
      bgColor: "bg-green-500",
    },
    {
      title: "Average Rating",
      value: "0.0",
      icon: Star,
      change: "0",
      changeType: "increase",
      color: "bg-purple-500",
      bgColor: "bg-purple-500",
    },
  ])

  const [recentActivities, setRecentActivities] = useState([])

  const [performanceData, setPerformanceData] = useState({
    totalClients: "0",
    completedJobs: "0",
    totalEarnings: "Rs. 0",
    responseRate: "0%",
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !user.id) return;
      
      setLoading(true);
      try {
        // Fetch dashboard metrics
        const dashboardMetrics = await getDashboardMetrics(user.id);
        
        // Update stats array with real data
        if (dashboardMetrics) {
          setStats([
            {
              title: "Total Services",
              value: dashboardMetrics.totalServices.toString(),
              icon: Briefcase,
              change: dashboardMetrics.percentChangeServices.toString(),
              changeType: dashboardMetrics.percentChangeServices >= 0 ? "increase" : "decrease",
              color: "bg-blue-500",
              bgColor: "bg-blue-500",
            },
            {
              title: "Total Revenue",
              value: `Rs. ${dashboardMetrics.totalRevenue.toFixed(2)}`,
              icon: DollarSign,
              change: dashboardMetrics.percentChangeRevenue.toString(),
              changeType: dashboardMetrics.percentChangeRevenue >= 0 ? "increase" : "decrease",
              color: "bg-green-500",
              bgColor: "bg-green-500",
            },
            {
              title: "Average Rating",
              value: dashboardMetrics.averageRating.toFixed(1),
              icon: Star,
              change: dashboardMetrics.percentChangeRating.toString(),
              changeType: dashboardMetrics.percentChangeRating >= 0 ? "increase" : "decrease",
              color: "bg-purple-500",
              bgColor: "bg-purple-500",
            },
          ]);
        }
        
        // Fetch performance metrics
        const performanceMetrics = await getPerformanceMetrics(user.id);
        if (performanceMetrics) {
          setPerformanceData({
            totalClients: performanceMetrics.totalClients.toString(),
            completedJobs: performanceMetrics.completedJobs.toString(),
            totalEarnings: `Rs. ${performanceMetrics.totalEarnings.toFixed(2)}`,
            responseRate: `${performanceMetrics.responseRate}%`,
          });
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user])

  return (
    <ServiceProviderLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.username || "Provider"}!</h1>
              <p className="mt-2 text-green-50">
                {loading ? (
                  <span className="opacity-75">Loading your dashboard...</span>
                ) : (
                  <>You have <span className="font-semibold">{stats[0]?.value || 0}</span> services listed</>
                )}
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
          {loading ? (
            <div className="col-span-4 flex justify-center items-center py-12">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-gray-600">Loading dashboard data...</span>
            </div>
          ) : (
            stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Real-time Notifications */}
          <div>
            <NotificationsWidget />
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