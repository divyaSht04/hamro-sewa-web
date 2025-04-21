import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Users,
  Briefcase,
  DollarSign,
  Star,
  Loader,
} from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"
import AdminNotificationsWidget from "../../components/admin/AdminNotificationsWidget"
import { getAdminDashboardMetrics } from "../../services/adminService"

const StatCard = ({ title, value, icon: Icon, color, isLoading }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    {isLoading ? (
      <div className="flex items-center justify-center h-10 mt-2">
        <Loader className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    ) : (
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    )}
  </div>
)

// AdminNotificationsWidget component replaces the RecentActivity component

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        setError('Failed to load dashboard metrics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  // Format currency with commas and 2 decimal places
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format ratings to 1 decimal place
  const formatRating = (rating) => {
    return rating.toFixed(1);
  };

  const stats = [
    {
      title: "Total Users",
      value: metrics ? metrics.totalUsers.toLocaleString() : '0',
      icon: Users,
      color: "bg-[#3366FF]",
    },
    {
      title: "Total Service Providers",
      value: metrics ? metrics.totalServiceProviders.toLocaleString() : '0',
      icon: Briefcase,
      color: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: metrics ? formatCurrency(metrics.totalRevenue) : '₨0.00',
      icon: DollarSign,
      color: "bg-yellow-500",
    },
    {
      title: "Avg. Rating",
      value: metrics ? formatRating(metrics.averageRating) : '0.0',
      icon: Star,
      color: "bg-purple-500",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} isLoading={loading} />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Notifications */}
          <AdminNotificationsWidget />

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

