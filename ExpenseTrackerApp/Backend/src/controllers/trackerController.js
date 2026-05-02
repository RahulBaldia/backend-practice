const Transaction = require('../models/transactionModel')

const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category } = req.body

    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      user: req.user._id,
    })

    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      date: -1,
    })

    res.status(200).json(transactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await transaction.deleteOne()

    res.status(200).json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpense

    res.status(200).json({ totalIncome, totalExpense, balance })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { addTransaction, getTransactions, deleteTransaction, getSummary }
