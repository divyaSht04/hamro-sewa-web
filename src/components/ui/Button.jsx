import { motion } from 'framer-motion';

export function Button({ children, isLoading, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        children
      )}
    </motion.button>
  );
}