import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../Context/AuthContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsRes = await axios.get('/api/transactions')
        setTransactions(transactionsRes.data)

        const goalsRes = await axios.get('/api/goals')
        setGoals(goalsRes.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'goal_withdrawal')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' || t.type === 'goal_contribution')
    .reduce((acc, t) => acc + t.amount, 0)

  const balance = totalIncome - totalExpenses

  if (loading) {
    return <div className="text-center text-xl">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8 p-4 bg-backgroundLight min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-extrabold text-textDark text-center mb-8"
      >
        Dashboard
      </motion.h1>

      {error && <p className="text-accent-700 text-center mb-4">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="card bg-secondary-100 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-xl font-semibold mb-2 text-secondary-700">Total Income</h3>
          <p className="text-4xl font-bold text-secondary-600">${totalIncome.toFixed(2)}</p>
        </motion.div>
        <motion.div
          className="card bg-accent-100 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-2 text-accent-700">Total Expenses</h3>
          <p className="text-4xl font-bold text-accent-600">-${totalExpenses.toFixed(2)}</p>
        </motion.div>
        <motion.div
          className="card bg-primary-100 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-2 text-primary-700">Current Balance</h3>
          <p className={`text-4xl font-bold ${balance >= 0 ? 'text-secondary-600' : 'text-accent-600'}`}>${balance.toFixed(2)}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="card p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-textDark">Savings Goals</h3>
          {goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal._id}
                  className="border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium text-textMedium">{goal.title}</h4>
                    <span className="text-sm text-textLight">${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-neutral-300 rounded-full h-2.5 mt-1">
                    <div
                      className={`h-2.5 rounded-full ${goal.status === 'completed' ? 'bg-secondary-500' : 'bg-primary-500'}`}
                      style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-textLight mt-2">
                    Progress: {Math.min(100, (goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}% - Status: <span className="capitalize">{goal.status}</span>
                  </p>
                </motion.div>
              ))}
              <Link to="/goals" className="text-primary-600 hover:text-primary-800 transition-colors duration-200 block mt-4 text-sm font-medium">View All Goals</Link>
            </div>
          ) : (
            <p className="text-textMedium">No savings goals set. <Link to="/goals/new" className="text-primary-600 hover:text-primary-800 transition-colors duration-200">Set a new goal</Link>.</p>
          )}
        </motion.div>
      </div>

      <motion.div
        className="card p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-textDark">Recent Transactions</h3>
        {transactions.length > 0 ? (
          <ul className="space-y-3">
            {transactions.slice(0, 5).map(transaction => (
              <motion.li
                key={transaction._id}
                className="flex justify-between items-center border-b border-neutral-200 pb-3 last:border-b-0 last:pb-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + transactions.indexOf(transaction) * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <div>
                  <span className={`font-semibold ${transaction.type === 'income' || transaction.type === 'goal_withdrawal' ? 'text-secondary-600' : 'text-accent-600'}`}>
                    {transaction.type === 'income' || transaction.type === 'goal_withdrawal' ? '+' : '-'}${(transaction.amount || 0).toFixed(2)}
                  </span>
                  <span className="text-textMedium ml-2">{transaction.description}</span>
                </div>
                <span className="text-sm text-textLight">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-textMedium">No recent transactions.</p>
        )}
        <Link to="/transactions/new" className="text-primary-600 hover:text-primary-800 transition-colors duration-200 block mt-4 text-sm font-medium">Add a transaction</Link>
      </motion.div>
    </div>
  )
} 