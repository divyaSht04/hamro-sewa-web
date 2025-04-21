import { motion } from "framer-motion"

export function ErrorDisplay({ message }) {
  const displayMessage = message && message.includes("Cannot read properties of undefined")
    ? "Server is currently unavailable. Please try again later."
    : message

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md"
    >
      {displayMessage}
    </motion.div>
  )
}
