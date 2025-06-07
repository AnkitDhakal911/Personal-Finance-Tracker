import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useAuth } from '../Context/AuthContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Admin() {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState(null)
  const [transactionStats, setTransactionStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAdminData = async () => {
      if (user?.role !== 'admin') {
        setError('Access Denied: You are not an admin.')
        setLoading(false)
        return
      }
      try {
        // Example: Fetch aggregated user stats (e.g., total users)
        // You would need to add an admin route for this in your backend (e.g., /api/users/stats)
        // const userStatsRes = await axios.get('/api/users/stats');
        // setUserStats(userStatsRes.data);

        // Example: Fetch aggregated transaction stats
        const transactionStatsRes = await axios.get('/api/transactions/stats')
        setTransactionStats(transactionStatsRes.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch admin data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [user])

  const transactionChartData = {
    labels: transactionStats?.map(stat => stat._id) || [],
    datasets: [
      {
        label: 'Total Amount',
        data: transactionStats?.map(stat => stat.total) || [],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
      {
        label: 'Number of Transactions',
        data: transactionStats?.map(stat => stat.count) || [],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 159, 64, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      }
    ],
  }

  if (loading) {
    return <div className="text-center text-xl">Loading admin dashboard...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>
  }

  if (user?.role !== 'admin') {
    return <div className="text-center text-red-500">Access Denied: You do not have administrator privileges.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Transaction Overview</h2>
          {transactionStats && transactionStats.length > 0 ? (
            <Bar data={transactionChartData} />
          ) : (
            <p className="text-gray-600">No transaction data available for analytics.</p>
          )}
        </div>

        {/* Add more admin-specific charts/data here */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">User Statistics (Placeholder)</h2>
          <p className="text-gray-600">Further user statistics (e.g., total users, average transactions per user) would be displayed here after implementing corresponding backend routes.</p>
        </div>
      </div>
    </div>
  )
} 