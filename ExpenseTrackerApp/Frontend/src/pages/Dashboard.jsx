import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:5000/api/transactions'

const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚌',
  Shopping: '🛍️',
  Salary: '💼',
  Freelance: '💻',
  Other: '📦',
}

const EMPTY_FORM = { title: '', amount: '', type: 'expense', category: 'Food' }

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export default function Dashboard() {
  const { logout } = useAuth()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userName = user.name || user.email?.split('@')[0] || 'User'

  const [transactions, setTransactions] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(API, { headers: authHeaders() })
        if (!res.ok) throw new Error('Failed to fetch transactions')
        const data = await res.json()
        setTransactions(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError('')
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.amount) {
      setFormError('Title and Amount are required.')
      return
    }
    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount <= 0) {
      setFormError('Enter a valid positive amount.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${API}/add`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title: form.title.trim(), amount, type: form.type, category: form.category }),
      })
      if (!res.ok) throw new Error('Failed to add transaction')
      const newTx = await res.json()
      setTransactions([newTx, ...transactions])
      setForm(EMPTY_FORM)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error('Failed to delete')
      setTransactions(transactions.filter((t) => t._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-sm">
              💰
            </div>
            <span className="text-white font-bold text-lg tracking-tight">ExpenseTracker</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-700/60 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold text-white uppercase">
                {userName[0]}
              </div>
              <span className="text-slate-300 text-sm font-medium capitalize">{userName}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white bg-slate-700/60 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>Logout</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Global error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none" />
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-400">{fmt(totalIncome)}</p>
            <span className="text-2xl absolute right-4 top-4 opacity-30">📈</span>
          </div>

          <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Expense</p>
            <p className="text-2xl font-bold text-red-400">{fmt(totalExpense)}</p>
            <span className="text-2xl absolute right-4 top-4 opacity-30">📉</span>
          </div>

          <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {fmt(balance)}
            </p>
            <span className="text-2xl absolute right-4 top-4 opacity-30">💳</span>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700/60">
          <h2 className="text-white font-semibold text-base mb-5">Add Transaction</h2>

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-4 text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Netflix subscription"
                  className="w-full bg-slate-700/60 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Amount ($)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full bg-slate-700/60 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full bg-slate-700/60 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-slate-700/60 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                >
                  {Object.keys(CATEGORY_ICONS).map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_ICONS[cat]} {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-8 rounded-xl transition-all text-sm shadow-lg shadow-indigo-600/20"
            >
              {submitting ? 'Adding...' : '+ Add Transaction'}
            </button>
          </form>
        </div>

        {/* Transaction List */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700/60">
          <div className="px-6 py-4 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-white font-semibold text-base">Transactions</h2>
            <span className="text-slate-500 text-sm">{transactions.length} total</span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-3 opacity-40">📭</div>
              <p className="text-slate-500 text-sm">No transactions yet. Add one above!</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-700/40">
              {transactions.map((tx) => (
                <li
                  key={tx._id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-700/20 transition-colors group"
                >
                  <div className="w-10 h-10 bg-slate-700/60 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {CATEGORY_ICONS[tx.category] || '📦'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{tx.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          tx.type === 'income'
                            ? 'bg-green-500/15 text-green-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {tx.type}
                      </span>
                      <span className="text-slate-500 text-xs">{tx.category}</span>
                      <span className="text-slate-600 text-xs">·</span>
                      <span className="text-slate-500 text-xs">{fmtDate(tx.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`font-semibold text-sm ${
                        tx.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                    </span>
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 hover:bg-red-400/10 w-7 h-7 rounded-lg flex items-center justify-center transition-all text-sm"
                      title="Delete transaction"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
