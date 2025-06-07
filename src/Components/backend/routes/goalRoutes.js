import express from 'express'
import { protect } from '../middleware/auth.js'
import Goal from '../models/goal.js'
import Transaction from '../models/transaction.js'

const router = express.Router()

// Get all goals for a user
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query

    // Build query
    const query = { userId: req.user.id }
    if (status) query.status = status

    const goals = await Goal.find(query).sort('-createdAt')
    res.json(goals)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get a single goal by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' })
    }

    res.json(goal)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create goal
router.post('/', protect, async (req, res) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      userId: req.user.id
    })

    res.status(201).json(goal)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update goal
router.put('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' })
    }

    // Check if goal is completed
    if (goal.status === 'completed' && req.body.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot modify a completed goal' })
    }

    // Update current amount
    if (req.body.currentAmount) {
      if (req.body.currentAmount >= goal.targetAmount) {
        req.body.status = 'completed'
      } else if (goal.status === 'completed') {
        req.body.status = 'active'
      }
    }

    Object.assign(goal, req.body)
    await goal.save()

    res.json(goal)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete goal
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' })
    }

    // If goal is not completed, transfer currentAmount back to main balance
    if (goal.status !== 'completed') {
      await Transaction.create({
        userId: req.user.id,
        amount: goal.currentAmount,
        type: 'income',
        description: `Refund from deleted goal: ${goal.title}`,
        date: new Date()
      })
    }

    // Unlink transactions associated with this goal and revert their types
    await Transaction.updateMany(
      { goalId: goal._id, userId: req.user.id },
      [{ $set: {
        goalId: null,
        type: {
          $cond: {
            if: { $eq: ['$type', 'goal_contribution'] },
            then: 'expense',
            else: {
              $cond: {
                if: { $eq: ['$type', 'goal_withdrawal'] },
                then: 'income',
                else: '$type'
              }
            }
          }
        }
      }}]
    )

    // Finally, delete the goal
    await goal.deleteOne()

    res.json({ message: 'Goal deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get goal statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await Goal.aggregate([
      {
        $match: { userId: req.user.id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalTarget: { $sum: '$targetAmount' },
          totalCurrent: { $sum: '$currentAmount' }
        }
      }
    ])

    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router 