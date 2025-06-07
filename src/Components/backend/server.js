import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { config } from './config.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
// import categoryRoutes from './routes/categoryRoutes.js' // Removed Categories import
import goalRoutes from './routes/goalRoutes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/transactions', transactionRoutes)
// app.use('/api/categories', categoryRoutes) // Removed Categories route
app.use('/api/goals', goalRoutes)

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

connectDB()

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
})

const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 