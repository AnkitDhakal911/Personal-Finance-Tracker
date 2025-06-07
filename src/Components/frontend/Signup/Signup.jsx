import { useState, useEffect } from 'react'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { signup, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const result = await signup(name, email, password)
    if (result.success) {
      navigate('/login')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-backgroundLight p-4">
      <motion.div
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-extrabold text-center text-textDark mb-6"
        >
          Sign Up
        </motion.h2>
        {error && <p className="text-accent-600 text-center mb-4">Error: {error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-textMedium">Name</label>
            <motion.input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={name}
              onChange={(e) => setName(e.target.value)}
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-textMedium">Email</label>
            <motion.input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-textMedium">Password</label>
            <motion.input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <motion.button
            type="submit"
            className="w-full btn bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 py-3 rounded-md font-semibold text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>
        </form>
        <p className="text-center text-sm text-textMedium">
          Already have an account? {''}
          <motion.a
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.a>
        </p>
      </motion.div>
    </div>
  )
} 