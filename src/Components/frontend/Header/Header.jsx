import { Link } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { motion } from 'framer-motion'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="bg-primary-700 text-white p-4 flex justify-between items-center shadow-lg"
    >
      <Link to="/home" className="font-bold text-xl hover:text-primary-100 transition-colors duration-200">Finance Tracker</Link>
      <nav>
        {user ? (
          <div className="flex items-center space-x-4 justify-around w-full">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/home" className="hover:text-primary-100 transition-colors duration-200">Dashboard</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/goals" className="hover:text-primary-100 transition-colors duration-200">Goals</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/profile" className="hover:text-primary-100 transition-colors duration-200">Profile</Link>
            </motion.div>
            {user.role === 'admin' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/admin" className="hover:text-primary-100 transition-colors duration-200">Admin</Link>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/about" className="hover:text-primary-100 transition-colors duration-200">About</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" className="hover:text-primary-100 transition-colors duration-200">Contact</Link>
            </motion.div>
            <motion.button
              onClick={logout}
              className="btn bg-primary-800 text-white hover:bg-primary-900 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 justify-around w-full">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="hover:text-primary-100 transition-colors duration-200">Login</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="hover:text-primary-100 transition-colors duration-200">Sign Up</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/about" className="hover:text-primary-100 transition-colors duration-200">About</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" className="hover:text-primary-100 transition-colors duration-200">Contact</Link>
            </motion.div>
          </div>
        )}
      </nav>
    </motion.header>
  )
} 