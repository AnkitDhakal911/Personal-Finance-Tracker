import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { motion } from 'framer-motion'

export default function CreateTransaction() {
  const { user } = useAuth()
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [goals, setGoals] = useState([])
  const [selectedGoalId, setSelectedGoalId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get('/api/goals')
        setGoals(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch goals')
      }
    }

    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`/api/transactions/${id}`)
        const transaction = response.data
        setType(transaction.type)
        setAmount(transaction.amount)
        setDescription(transaction.description)
        setDate(new Date(transaction.date).toISOString().split('T')[0])
        setSelectedGoalId(transaction.goalId || '')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transaction')
      }
    }

    if (user) {
      fetchGoals()
      if (isEditing) {
        fetchTransaction()
      }
    }
    setLoading(false)
  }, [user, id, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!type || !amount || !description || !date) {
      setError('Please fill in all required fields: Type, Amount, Description, and Date.')
      return
    }

    const transactionData = {
      type,
      amount: parseFloat(amount),
      description,
      date,
      goalId: selectedGoalId || undefined
    }

    try {
      if (isEditing) {
        await axios.put(`/api/transactions/${id}`, transactionData)
        setMessage('Transaction updated successfully!')
      } else {
        await axios.post('/api/transactions', transactionData)
        setMessage('Transaction added successfully!')
      }
      setType('expense')
      setAmount('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      setSelectedGoalId('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction')
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
          {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
        </motion.h1>

        {message && <p className="text-secondary-600 text-center mb-4">{message}</p>}
        {error && <p className="text-accent-600 text-center mb-4">Error: {error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-textMedium">Type</label>
            <motion.select
              id="type"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </motion.select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-textMedium">Amount</label>
            <motion.input
              id="amount"
              type="number"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <div>
            <label htmlFor="link-to-goal" className="block text-sm font-medium text-textMedium">Link to Goal (Optional)</label>
            <motion.select
              id="link-to-goal"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              whileFocus={{ scale: 1.01 }}
            >
              <option value="">None</option>
              {goals.map(goal => (
                <option key={goal._id} value={goal._id}>{goal.title}</option>
              ))}
            </motion.select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-textMedium">Description</label>
            <motion.textarea
              id="description"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              required
              whileFocus={{ scale: 1.01 }}
            ></motion.textarea>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-textMedium">Date</label>
            <motion.input
              id="date"
              type="date"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <motion.button
            type="submit"
            className="btn w-full bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 py-3 rounded-md font-semibold text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
} 