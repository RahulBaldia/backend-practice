const express = require('express')
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getSummary,
} = require('../controllers/trackerController')
const protect = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(protect)

router.post('/add', addTransaction)
router.get('/', getTransactions)
router.delete('/:id', deleteTransaction)
router.get('/summary', getSummary)

module.exports = router
