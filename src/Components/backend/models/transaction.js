import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'goal_contribution', 'goal_withdrawal'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount cannot be negative']
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: false
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for faster queries
transactionSchema.index({ userId: 1, date: -1 })

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction 