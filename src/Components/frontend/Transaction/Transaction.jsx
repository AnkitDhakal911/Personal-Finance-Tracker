import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

export default function Transaction() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`/api/transactions/${id}`)
        setTransaction(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch transaction')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchTransaction()
    }
  }, [id, user])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return
    }
    setError(null)
    setMessage(null)
    try {
      await axios.delete(`/api/transactions/${id}`)
      setMessage('Transaction deleted successfully!')
      navigate('/') // Redirect to dashboard after deletion
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete transaction')
    }
  }

  if (loading) {
    return <div className="text-center text-xl">Loading transaction...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>
  }

  if (!transaction) {
    return <div className="text-center text-gray-600">Transaction not found.</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Transaction Details</h1>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="space-y-4">
          <p><strong>Type:</strong> <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{transaction.type}</span></p>
          <p><strong>Amount:</strong> <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</span></p>
          <p><strong>Category:</strong> {transaction.categoryId ? transaction.categoryId.name : 'N/A'}</p>
          <p><strong>Description:</strong> {transaction.description}</p>
          <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
          <p><strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex justify-between mt-6">
          <Link
            to={`/transactions/edit/${transaction._id}`}
            className="btn btn-primary"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-secondary bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
} 