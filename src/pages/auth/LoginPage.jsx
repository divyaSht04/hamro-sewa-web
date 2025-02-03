import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthForm } from '../../components/auth/AuthFrom';

import { LogIn, UserPlus } from 'lucide-react';
export function LoginPage() {
  const navigate = useNavigate();

  return (  
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
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

        <AuthForm type="login" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary font-medium hover:text-primary-dark transition-colors inline-flex items-center"
            >
              <UserPlus size={16} className="mr-1" />
              Register here
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

