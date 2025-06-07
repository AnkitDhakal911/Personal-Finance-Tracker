import mongoose from 'mongoose'

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a goal title'],
    trim: true
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please provide a target amount'],
    min: [0, 'Target amount cannot be negative']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline']
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  }
}, {
  timestamps: true
})

// Index for faster queries
goalSchema.index({ userId: 1, status: 1 })
goalSchema.index({ userId: 1, deadline: 1 })

// Virtual for progress percentage
goalSchema.virtual('progress').get(function() {
  return (this.currentAmount / this.targetAmount) * 100
})

const Goal = mongoose.model('Goal', goalSchema)

export default Goal 