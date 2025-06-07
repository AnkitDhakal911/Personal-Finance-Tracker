import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { motion } from 'framer-motion'

export default function Goals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [transferAmount, setTransferAmount] = useState('')
  const [selectedTransferGoalId, setSelectedTransferGoalId] = useState('')

  const fetchGoalsAndTransactions = async () => {
    try {
      const goalsResponse = await axios.get('/api/goals')
      setGoals(goalsResponse.data)

      const transactionsResponse = await axios.get('/api/transactions')
      setTransactions(transactionsResponse.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchGoalsAndTransactions()
    }
  }, [user])

  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'goal_withdrawal')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' || t.type === 'goal_contribution')
    .reduce((acc, t) => acc + t.amount, 0)

  const currentBalance = totalIncome - totalExpenses

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return
    }
    setError(null)
    setMessage(null)
    try {
      await axios.delete(`/api/goals/${id}`)
      setMessage('Goal deleted successfully!')
      fetchGoalsAndTransactions()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete goal')
    }
  }

  const handleContributeToGoal = async () => {
    setError(null)
    setMessage(null)
    if (!transferAmount || !selectedTransferGoalId) {
      setError('Please enter an amount and select a goal.')
      return
    }

    const amountToContribute = parseFloat(transferAmount)

    if (isNaN(amountToContribute) || amountToContribute <= 0) {
      setError('Please enter a valid positive amount.')
      return
    }

    if (currentBalance < amountToContribute) {
      setError('Insufficient funds. You do not have enough money in your balance to contribute this amount.')
      return
    }

    try {
      await axios.post('/api/transactions', {
        type: 'goal_contribution',
        amount: amountToContribute,
        goalId: selectedTransferGoalId,
        description: `Contribution to goal: ${goals.find(g => g._id === selectedTransferGoalId)?.title || ''}`,
        date: new Date().toISOString().split('T')[0],
      })
      setMessage('Funds successfully added to goal!')
      setTransferAmount('')
      setSelectedTransferGoalId('')
      fetchGoalsAndTransactions()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add funds to goal.')
    }
  }

  const handleWithdrawFromGoal = async () => {
    setError(null)
    setMessage(null)
    if (!transferAmount || !selectedTransferGoalId) {
      setError('Please enter an amount and select a goal.')
      return
    }

    const selectedGoal = goals.find(g => g._id === selectedTransferGoalId)
    if (!selectedGoal || parseFloat(transferAmount) > selectedGoal.currentAmount) {
      setError('Cannot withdraw more than current amount saved in goal.')
      return
    }

    try {
      await axios.post('/api/transactions', {
        type: 'goal_withdrawal',
        amount: parseFloat(transferAmount),
        goalId: selectedTransferGoalId,
        description: `Withdrawal from goal: ${selectedGoal.title}`,
        date: new Date().toISOString().split('T')[0],
      })
      setMessage('Funds successfully withdrawn from goal!')
      setTransferAmount('')
      setSelectedTransferGoalId('')
      fetchGoalsAndTransactions()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to withdraw funds from goal.')
    }
  }

  if (loading) {
    return <div className="text-center text-xl">Loading goals...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-backgroundLight min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-extrabold text-textDark text-center mb-8"
      >
        My Savings Goals
      </motion.h1>

      <motion.div
        className="flex justify-end mb-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link to="/goals/new" className="btn bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200">
          Add New Goal
        </Link>
      </motion.div>

      <motion.div
        className="card mb-8 p-8 rounded-xl shadow-xl bg-white"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-textDark">Transfer Funds to/from Goals</h2>
        {message && <p className="text-secondary-600 text-center mb-4">{message}</p>}
        {error && <p className="text-accent-600 text-center mb-4">Error: {error}</p>}
        <form className="space-y-4">
          <div>
            <label htmlFor="transfer-amount" className="block text-sm font-medium text-textMedium">Amount</label>
            <input
              id="transfer-amount"
              type="number"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="transfer-goal" className="block text-sm font-medium text-textMedium">Select Goal</label>
            <select
              id="transfer-goal"
              className="input mt-1 border-neutral-300 focus:ring-primary-500 focus:border-transparent text-textDark"
              value={selectedTransferGoalId}
              onChange={(e) => setSelectedTransferGoalId(e.target.value)}
              required
            >
              <option value="" className="text-textMedium">Select a goal</option>
              {goals.map(goal => (
                <option key={goal._id} value={goal._id}>{goal.title}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <motion.button
              type="button"
              onClick={handleContributeToGoal}
              className="btn bg-secondary-600 text-white hover:bg-secondary-700 transition-colors duration-200 w-1/2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Add to Goal
            </motion.button>
            <motion.button
              type="button"
              onClick={handleWithdrawFromGoal}
              className="btn bg-accent-600 text-white hover:bg-accent-700 transition-colors duration-200 w-1/2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Withdraw from Goal
            </motion.button>
          </div>
        </form>
      </motion.div>

      {goals.length === 0 ? (
        <motion.p
          className="text-center text-textMedium mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          You haven't set any savings goals yet. Start by <Link to="/goals/new" className="text-primary-600 hover:text-primary-800 transition-colors duration-200">adding one</Link>!
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal._id}
              className="card p-6 rounded-xl shadow-lg bg-white flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-textDark">{goal.title}</h2>
                <p className="text-textMedium mb-1">Target: <span className="font-medium">${goal.targetAmount.toFixed(2)}</span></p>
                <p className="text-textMedium mb-1">Current: <span className="font-medium">${goal.currentAmount.toFixed(2)}</span></p>
                <p className="text-textLight text-sm mb-2">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                {goal.description && <p className="text-textLight text-sm mb-2">{goal.description}</p>}

                <div className="w-full bg-neutral-300 rounded-full h-4 mb-2">
                  <div
                    className={`h-4 rounded-full ${goal.status === 'completed' ? 'bg-secondary-500' : 'bg-primary-500'}`}
                    style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-textLight mb-4">
                  Progress: {Math.min(100, (goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}% - Status: <span className="capitalize">{goal.status}</span>
                </p>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Link
                  to={`/goals/edit/${goal._id}`}
                  className="btn bg-neutral-200 text-textMedium hover:bg-neutral-300 transition-colors duration-200 text-sm"
                >
                  Edit
                </Link>
                <motion.button
                  onClick={() => handleDeleteGoal(goal._id)}
                  className="btn bg-accent-500 text-white hover:bg-accent-600 transition-colors duration-200 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 