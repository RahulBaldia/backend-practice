const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transaction.routes')

const app = express()

connectDB()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'ExpenseTracker API is running' })
})

module.exports = app
