import express from 'express'
import { protect, restrictTo } from '../middleware/auth.js'
import Transaction from '../models/transaction.js'
import Goal from '../models/goal.js'

const router = express.Router()

// Get all transactions for a user
router.get('/', protect, async (req, res) => {
  try {
    const { type, startDate, endDate, sort = '-date' } = req.query

    // Build query
    const query = { userId: req.user.id }
    if (type) query.type = type
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(query)
      .sort(sort)
      // .populate('categoryId', 'name color icon') // Removed category population

    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create transaction
router.post('/', protect, async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.user.id
    })

    // Update goal current amount if goalId is provided
    if (transaction.goalId) {
      const goal = await Goal.findById(transaction.goalId)
      if (goal && goal.userId.equals(req.user.id)) { // Ensure user owns the goal
        console.log(`[Goal Update - POST] Before: Goal ID: ${goal._id}, Current Amount: ${goal.currentAmount}, Transaction Type: ${transaction.type}, Transaction Amount: ${transaction.amount}`)
        if (transaction.type === 'income' || transaction.type === 'goal_contribution') {
          goal.currentAmount += transaction.amount
        } else if (transaction.type === 'expense' || transaction.type === 'goal_withdrawal') {
          goal.currentAmount -= transaction.amount
        }
        console.log(`[Goal Update - POST] After calculation: Current Amount: ${goal.currentAmount}`)
        if (goal.currentAmount >= goal.targetAmount) {
          goal.status = 'completed'
        } else if (goal.currentAmount < goal.targetAmount && goal.status === 'completed') {
          // If goal was completed but now below target, set back to active
          goal.status = 'active'
        }
        await goal.save()
        console.log(`[Goal Update - POST] After save: Current Amount: ${goal.currentAmount}, Status: ${goal.status}`)
      } else {
        console.warn(`Goal with ID ${transaction.goalId} not found or not owned by user ${req.user.id}. Cannot update goal.`) // Log warning if goal not found/owned
      }
    }

    // await transaction.populate('categoryId', 'name color icon') // Removed category population
    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update transaction
router.put('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    const oldAmount = transaction.amount
    const oldType = transaction.type
    const oldGoalId = transaction.goalId

    console.log(`[Transaction Update - PUT] Old: Amount: ${oldAmount}, Type: ${oldType}, GoalId: ${oldGoalId}`)
    Object.assign(transaction, req.body)
    await transaction.save()
    console.log(`[Transaction Update - PUT] New: Amount: ${transaction.amount}, Type: ${transaction.type}, GoalId: ${transaction.goalId}`)

    // Handle goal update if goalId changed or amount/type changed for linked goal
    if (oldGoalId && !transaction.goalId) { // Unlinked from a goal
      const oldGoal = await Goal.findById(oldGoalId)
      if (oldGoal && oldGoal.userId.equals(req.user.id)) {
        console.log(`[Goal Update - PUT] Unlinking: Goal ID: ${oldGoal._id}, Before: ${oldGoal.currentAmount}`)
        if (oldType === 'income' || oldType === 'goal_contribution') {
          oldGoal.currentAmount -= oldAmount // Correct: Subtract old contribution
        } else if (oldType === 'expense' || oldType === 'goal_withdrawal') {
          oldGoal.currentAmount += oldAmount // Correct: Add back old deduction
        }
        console.log(`[Goal Update - PUT] Unlinking: After calc: ${oldGoal.currentAmount}`)
        if (oldGoal.currentAmount < oldGoal.targetAmount) {
          oldGoal.status = 'active'
        }
        await oldGoal.save()
        console.log(`[Goal Update - PUT] Unlinking: After save: ${oldGoal.currentAmount}, Status: ${oldGoal.status}`)
      }
    } else if (!oldGoalId && transaction.goalId) { // Linked to a new goal
      const newGoal = await Goal.findById(transaction.goalId)
      if (newGoal && newGoal.userId.equals(req.user.id)) {
        console.log(`[Goal Update - PUT] Linking: Goal ID: ${newGoal._id}, Before: ${newGoal.currentAmount}`)
        if (transaction.type === 'income' || transaction.type === 'goal_contribution') {
          newGoal.currentAmount += transaction.amount // Correct: Add new contribution
        } else if (transaction.type === 'expense' || transaction.type === 'goal_withdrawal') {
          newGoal.currentAmount -= transaction.amount // Correct: Deduct new expense/withdrawal
        }
        console.log(`[Goal Update - PUT] Linking: After calc: ${newGoal.currentAmount}`)
        if (newGoal.currentAmount >= newGoal.targetAmount) {
          newGoal.status = 'completed'
        } else if (newGoal.currentAmount < newGoal.targetAmount && newGoal.status === 'completed') {
          newGoal.status = 'active'
        }
        await newGoal.save()
        console.log(`[Goal Update - PUT] Linking: After save: ${newGoal.currentAmount}, Status: ${newGoal.status}`)
      }
    } else if (oldGoalId && transaction.goalId && oldGoalId.toString() === transaction.goalId.toString()) { // Same goal, amount/type changed
      const currentGoal = await Goal.findById(transaction.goalId)
      if (currentGoal && currentGoal.userId.equals(req.user.id)) {
        console.log(`[Goal Update - PUT] Same Goal: ID: ${currentGoal._id}, Before: ${currentGoal.currentAmount}, Old Type: ${oldType}, Old Amount: ${oldAmount}, New Type: ${transaction.type}, New Amount: ${transaction.amount}`)
        // Reverse old amount, then apply new amount
        if (oldType === 'income' || oldType === 'goal_contribution') {
          currentGoal.currentAmount -= oldAmount
        } else if (oldType === 'expense' || oldType === 'goal_withdrawal') {
          currentGoal.currentAmount += oldAmount
        }

        if (transaction.type === 'income' || transaction.type === 'goal_contribution') {
          currentGoal.currentAmount += transaction.amount
        } else if (transaction.type === 'expense' || transaction.type === 'goal_withdrawal') {
          currentGoal.currentAmount -= transaction.amount
        }
        console.log(`[Goal Update - PUT] Same Goal: After calc: ${currentGoal.currentAmount}`)
        if (currentGoal.currentAmount >= currentGoal.targetAmount) {
          currentGoal.status = 'completed'
        } else if (currentGoal.currentAmount < currentGoal.targetAmount && currentGoal.status === 'completed') {
          currentGoal.status = 'active'
        }
        await currentGoal.save()
        console.log(`[Goal Update - PUT] Same Goal: After save: ${currentGoal.currentAmount}, Status: ${currentGoal.status}`)
      }
    } else if (oldGoalId && transaction.goalId && oldGoalId.toString() !== transaction.goalId.toString()) { // Changed from one goal to another
      // Deduct from old goal
      const oldGoal = await Goal.findById(oldGoalId)
      if (oldGoal && oldGoal.userId.equals(req.user.id)) {
        console.log(`[Goal Update - PUT] Changing Goal (Old): ID: ${oldGoal._id}, Before: ${oldGoal.currentAmount}`)
        if (oldType === 'income' || oldType === 'goal_contribution') {
          oldGoal.currentAmount -= oldAmount
        } else if (oldType === 'expense' || oldType === 'goal_withdrawal') {
          oldGoal.currentAmount += oldAmount
        }
        console.log(`[Goal Update - PUT] Changing Goal (Old): After calc: ${oldGoal.currentAmount}`)
        if (oldGoal.currentAmount < oldGoal.targetAmount) {
          oldGoal.status = 'active'
        }
        await oldGoal.save()
        console.log(`[Goal Update - PUT] Changing Goal (Old): After save: ${oldGoal.currentAmount}, Status: ${oldGoal.status}`)
      }

      // Add to new goal
      const newGoal = await Goal.findById(transaction.goalId)
      if (newGoal && newGoal.userId.equals(req.user.id)) {
        console.log(`[Goal Update - PUT] Changing Goal (New): ID: ${newGoal._id}, Before: ${newGoal.currentAmount}`)
        if (transaction.type === 'income' || transaction.type === 'goal_contribution') {
          newGoal.currentAmount += transaction.amount
        } else if (transaction.type === 'expense' || transaction.type === 'goal_withdrawal') {
          newGoal.currentAmount -= transaction.amount
        }
        console.log(`[Goal Update - PUT] Changing Goal (New): After calc: ${newGoal.currentAmount}`)
        if (newGoal.currentAmount >= newGoal.targetAmount) {
          newGoal.status = 'completed'
        } else if (newGoal.currentAmount < newGoal.targetAmount && newGoal.status === 'completed') {
          newGoal.status = 'active'
        }
        await newGoal.save()
        console.log(`[Goal Update - PUT] Changing Goal (New): After save: ${newGoal.currentAmount}, Status: ${newGoal.status}`)
      }
    }

    // await transaction.populate('categoryId', 'name color icon') // Removed category population

    res.json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete transaction
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    // Handle goal update if a goal was linked to the deleted transaction
    if (transaction.goalId) {
      const goal = await Goal.findById(transaction.goalId)
      if (goal && goal.userId.equals(req.user.id)) {
        console.log(`[Goal Update - DELETE] Before: Goal ID: ${goal._id}, Current Amount: ${goal.currentAmount}, Transaction Type: ${transaction.type}, Transaction Amount: ${transaction.amount}`)
        if (transaction.type === 'income' || transaction.type === 'goal_contribution') {
          goal.currentAmount -= transaction.amount // Correct: Revert contribution (subtract)
        } else if (transaction.type === 'expense' || transaction.type === 'goal_withdrawal') {
          goal.currentAmount += transaction.amount // Correct: Revert withdrawal (add back)
        }
        console.log(`[Goal Update - DELETE] After calc: ${goal.currentAmount}`)
        if (goal.currentAmount < goal.targetAmount) {
          goal.status = 'active'
        }
        await goal.save()
        console.log(`[Goal Update - DELETE] After save: ${goal.currentAmount}, Status: ${goal.status}`)
      }
    }

    res.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get transaction statistics (admin only)
router.get('/stats', protect, restrictTo('admin'), async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ])

    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router 