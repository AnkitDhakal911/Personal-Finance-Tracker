import express from 'express'
import { protect } from '../middleware/auth.js'
import User from '../models/user.js'

const router = express.Router()

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body

    // Check if email is already taken
    if (email !== req.user.email) {
      const emailExists = await User.findOne({ email })
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' })
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password')

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select('+password')

    // Check current password
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router 