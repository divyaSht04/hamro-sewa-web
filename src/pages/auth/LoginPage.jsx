import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { UserPlus } from "lucide-react"
import { AuthForm } from '../../components/auth/AuthFrom'
import { useAuth } from '../../auth/AuthContext'
import { toast } from "react-hot-toast"

export function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    setError("")
    
    try {
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required")
      }

      const { success, error } = await login(formData.email, formData.password)
      
      if (!success && error) {
        throw new Error(error)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message)
      toast.error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex bg-white rounded-xl shadow-2xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-8"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Welcome Back!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Enter your credentials to access your account
            </motion.p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md"
            >
              {error}
            </motion.div>
          )}

          <AuthForm type="login" onSubmit={handleSubmit} isLoading={isLoading} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-primary font-medium hover:text-primary-dark transition-colors inline-flex items-center"
              >
                <UserPlus size={16} className="mr-1" />
                Register here
              </button>
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
          }}
        >
          <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <h2 className="text-4xl font-bold mb-4">Welcome to Hamro Sewa</h2>
              <p className="text-xl">Your trusted partner for quality home services</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
