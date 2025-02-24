import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LogIn } from "lucide-react"
import { AuthForm } from "../../components/auth/AuthFrom"
import { registerServiceProvider } from "../../services/registrationService"
import toast from "react-hot-toast"

export function ProviderRegisterPage() {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    try {
      const response = await registerServiceProvider(formData)
      toast.success("Registration successful! Please login to continue.")
      navigate('/login')
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.")
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
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              src="/logo.png"
              alt="Hamro Sewa Logo"
              className="w-16 h-16 mx-auto mb-4"
            />
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Register as Service Provider
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Join Hamro Sewa and start providing your services
            </motion.p>
          </div>

          <AuthForm type="register" userType="provider" onSubmit={handleSubmit} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary font-medium hover:text-primary-dark transition-colors inline-flex items-center"
              >
                <LogIn size={16} className="mr-1" />
                Login here
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
              "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
          }}
        >
          <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <h2 className="text-4xl font-bold mb-4">Grow Your Business</h2>
              <p className="text-xl">Connect with customers and expand your service area</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
