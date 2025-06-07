import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../Context/AuthContext'
import { Link } from 'react-router-dom'

export default function Search() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) {
      setTransactions([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`/api/transactions?description=${query}&categoryName=${query}`)
      setTransactions(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to perform search')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="text-center text-red-500">Please log in to use search functionality.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Search Transactions</h1>

      <form onSubmit={handleSearch} className="flex items-center space-x-4 mb-8">
        <input
          type="text"
          className="input flex-grow"
          placeholder="Search by description or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {loading && <p className="text-center text-xl">Searching...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && transactions.length === 0 && query.trim() && (
        <p className="text-center text-gray-600">No transactions found matching your search.</p>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
          <ul className="space-y-2">
            {transactions.map(transaction => (
              <li key={transaction._id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                <div>
                  <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <span className="text-gray-600 ml-2">{transaction.description}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {transaction.categoryId ? transaction.categoryId.name : 'N/A'} - {new Date(transaction.date).toLocaleDateString()}
                  <Link to={`/transactions/${transaction._id}`} className="ml-2 text-primary-600 hover:underline">View</Link>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 