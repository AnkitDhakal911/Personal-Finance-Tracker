import { useState, useEffect } from 'react'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const result = await login(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full btn btn-primary"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account? {''}
          <a href="/" className="font-medium text-primary-600 hover:text-primary-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
} 