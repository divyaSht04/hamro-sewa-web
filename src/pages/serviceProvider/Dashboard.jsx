import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import ServiceProviderLayout from "../../components/serviceProvider/ServiceProviderLayout"
import api from "../../api/api"

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

export function ServiceProviderDashboard() {
  const [stats, setStats] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await api.get("/provider/stats")
        setStats(statsResponse.data)

        const activitiesResponse = await api.get("/provider/recent-activities")
        setRecentActivities(activitiesResponse.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    fetchDashboardData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewService((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await api.post("/services/apply", newService)
      setSubmitMessage({ type: "success", text: "Service application submitted successfully!" })
      setNewService({ name: "", description: "", price: "", category: "" })
    } catch (error) {
      setSubmitMessage({ type: "error", text: "Failed to submit service application. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ServiceProviderLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Service Provider Dashboard</h1>

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

          {/* Apply for New Service */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Apply for New Service</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newService.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={newService.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="gardening">Gardening</option>
                    <option value="painting">Painting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={newService.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newService.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
            {submitMessage && (
              <div
                className={`mt-4 p-2 rounded ${
                  submitMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {submitMessage.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </ServiceProviderLayout>
  )
}

