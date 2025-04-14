import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LogIn } from "lucide-react"
import { AuthForm } from "../../components/auth/AuthFrom"
import { OTPVerification } from "../../components/auth/OTPVerification"
import { initiateCustomerRegistration, verifyCustomerRegistration } from "../../services/registrationService"
import toast from "react-hot-toast"

export function UserRegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState("registration") // "registration" or "verification"
  const [registrationData, setRegistrationData] = useState(null)
  const [userEmail, setUserEmail] = useState("")
  const [userImage, setUserImage] = useState(null) // Store image for re-upload during verification

  // Step 1: Initiate registration and send OTP
  const handleInitiateRegistration = async (formData) => {
    try {
      setRegistrationData(formData) // Store form data for later use
      setUserEmail(formData.email) // Store email for OTP verification
      
      // Store image for re-upload during verification
      if (formData.photo) {
        setUserImage(formData.photo)
      }
      
      await initiateCustomerRegistration(formData)
      toast.success("Verification code sent to your email")
      setStep("verification") // Move to verification step
    } catch (error) {
      toast.error(error.message || "Registration initiation failed. Please try again.")
    }
  }

  // Step 2: Verify OTP and complete registration
  const handleVerifyOTP = async (otpValue) => {
    try {
      const verificationData = {
        email: userEmail,
        otp: otpValue
      }
      
      // Pass the stored image from step 1 as second parameter for re-upload
      await verifyCustomerRegistration(verificationData, userImage)
      toast.success("Registration successful! Please login to continue.")
      navigate('/login')
    } catch (error) {
      toast.error(error.message || "Verification failed. Please try again.")
      throw error // Rethrow to handle in OTPVerification component
    }
  }

  // Handle OTP resend
  const handleResendOTP = async () => {
    if (!registrationData) {
      toast.error("Registration data missing. Please start over.")
      setStep("registration")
      return
    }
    
    try {
      await initiateCustomerRegistration(registrationData)
      return true // Indicate success to the OTP component
    } catch (error) {
      toast.error(error.message || "Failed to resend verification code.")
      throw error
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
              Create Customer Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Join Hamro Sewa as a customer
            </motion.p>
          </div>

          {step === "registration" ? (
            <AuthForm type="register" userType="customer" onSubmit={handleInitiateRegistration} />
          ) : (
            <OTPVerification 
              email={userEmail} 
              onVerify={handleVerifyOTP} 
              onResend={handleResendOTP}
              userType="customer"
            />
          )}

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
