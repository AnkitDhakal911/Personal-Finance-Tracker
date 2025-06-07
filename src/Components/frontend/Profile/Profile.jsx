import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../Context/AuthContext'
import { motion } from 'framer-motion'

export default function Profile() {
  const { user, logout } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    try {
      const response = await axios.put('/api/users/profile', { name, email })
      setMessage('Profile updated successfully!')
      // Optionally update user in context
      // setUser(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    try {
      await axios.put('/api/users/change-password', { currentPassword, newPassword })
      setMessage('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-backgroundLight p-4">
      <motion.div
        className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-extrabold text-center text-textDark mb-6"
        >
          User Profile
        </motion.h1>

        {message && <p className="text-secondary-600 text-center mb-4">{message}</p>}
        {error && <p className="text-accent-600 text-center mb-4">Error: {error}</p>}

        {/* Profile Update Form */}
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-semibold text-textDark mb-4"
        >
          Update Profile Information
        </motion.h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4 mb-8">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-textMedium">Name</label>
            <motion.input
              id="profile-name"
              type="text"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-textMedium">Email</label>
            <motion.input
              id="profile-email"
              type="email"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <motion.button
            type="submit"
            className="btn bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 py-2 px-4 rounded-md font-semibold text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Update Profile
          </motion.button>
        </form>

        {/* Change Password Form */}
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl font-semibold text-textDark mb-4"
        >
          Change Password
        </motion.h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-textMedium">Current Password</label>
            <motion.input
              id="current-password"
              type="password"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-textMedium">New Password</label>
            <motion.input
              id="new-password"
              type="password"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-textMedium">Confirm New Password</label>
            <motion.input
              id="confirm-password"
              type="password"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <motion.button
            type="submit"
            className="btn bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 py-2 px-4 rounded-md font-semibold text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Change Password
          </motion.button>
        </form>

        <motion.button
          onClick={logout}
          className="w-full btn bg-neutral-200 text-textMedium hover:bg-neutral-300 transition-colors duration-200 mt-8 py-3 rounded-md font-semibold text-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  )
} 