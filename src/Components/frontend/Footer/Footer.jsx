import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="bg-neutral-800 text-neutral-200 text-center p-4 mt-8 shadow-inner"
    >
      <p>Personal Finance Tracker &copy; {new Date().getFullYear()}</p>
    </motion.footer>
  )
} 