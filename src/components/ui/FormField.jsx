import { motion } from 'framer-motion';

export function FormField({
  title,
  error,
  containerClassName = '',
  className = '',
  ...props
}) {
  return (
    <motion.div 
      className={`mb-4 ${containerClassName}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {title}
      </label>
      <input
        className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}