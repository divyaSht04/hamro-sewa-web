import React from 'react';
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthForm } from '../../components/auth/AuthFrom';
import { LogIn, User, Briefcase } from "lucide-react"

export function RegisterPage() {
  const navigate = useNavigate()
  const [userType, setUserType] = useState("customer")

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
              Create Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Join Hamro Sewa as a customer or service provider
            </motion.p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setUserType("customer")}
              className={`flex items-center px-4 py-2 rounded-full ${
                userType === "customer" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors duration-200`}
            >
              <User className="mr-2" size={18} />
              Customer
            </button>
            <button
              onClick={() => setUserType("provider")}
              className={`flex items-center px-4 py-2 rounded-full ${
                userType === "provider" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors duration-200`}
            >
              <Briefcase className="mr-2" size={18} />
              Service Provider
            </button>
          </div>

          <AuthForm type="register" userType={userType} />

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
              <h2 className="text-4xl font-bold mb-4">Welcome to Hamro Sewa</h2>
              <p className="text-xl">Your one-stop solution for all home services</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}