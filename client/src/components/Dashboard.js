import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, balanceRes] = await Promise.all([
          axios.get('/api/transactions'),
          axios.get('/api/balance'),
        ]);
        setTransactions(transactionsRes.data);
        setBalance(balanceRes.data.balance);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Welcome, {user?.name}!
              </h2>
              <div className="mt-5">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-indigo-900">
                    Current Balance
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-indigo-600">
                    ${balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Transactions
            </h3>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <li key={transaction._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {transaction.description}
                          </p>
                          <p className="ml-2 text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.type === 'income'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}$
                            {transaction.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 