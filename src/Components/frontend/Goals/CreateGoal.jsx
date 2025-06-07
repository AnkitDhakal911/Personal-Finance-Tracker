import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { motion } from 'framer-motion'

export default function CreateGoal() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('0')
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await axios.get(`/api/goals/${id}`)
        const goal = response.data
        setTitle(goal.title)
        setTargetAmount(goal.targetAmount)
        setCurrentAmount(goal.currentAmount)
        setDeadline(new Date(goal.deadline).toISOString().split('T')[0])
        setDescription(goal.description || '')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch goal')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (isEditing) {
      if (user) {
        fetchGoal()
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [user, id, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const goalData = {
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline,
      description,
    }

    try {
      if (isEditing) {
        await axios.put(`/api/goals/${id}`, goalData)
        setMessage('Goal updated successfully!')
      } else {
        await axios.post('/api/goals', goalData)
        setMessage('Goal added successfully!')
      }
      navigate('/goals') // Redirect to goals list after successful operation
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal')
    }
  }

  if (loading) {
    return <div className="text-center text-xl">Loading form...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-backgroundLight p-4">
      <motion.div
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl"
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
          {isEditing ? 'Edit Savings Goal' : 'Add New Savings Goal'}
        </motion.h1>

        {message && <p className="text-secondary-600 text-center mb-4">{message}</p>}
        {error && <p className="text-accent-600 text-center mb-4">Error: {error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-textMedium">Goal Title</label>
            <motion.input
              id="title"
              type="text"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-textMedium">Target Amount</label>
            <motion.input
              id="targetAmount"
              type="number"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              step="0.01"
              min="0"
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <div>
            <label htmlFor="currentAmount" className="block text-sm font-medium text-textMedium">Current Amount</label>
            <motion.input
              id="currentAmount"
              type="number"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              step="0.01"
              min="0"
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-textMedium">Deadline</label>
            <motion.input
              id="deadline"
              type="date"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-textMedium">Description (Optional)</label>
            <motion.textarea
              id="description"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              whileFocus={{ scale: 1.01 }}
            ></motion.textarea>
          </div>
          <motion.button
            type="submit"
            className="w-full btn bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 py-3 rounded-md font-semibold text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isEditing ? 'Update Goal' : 'Add Goal'}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => navigate('/goals')}
            className="w-full btn bg-neutral-200 text-textMedium hover:bg-neutral-300 transition-colors duration-200 mt-2 py-3 rounded-md font-semibold text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
} 