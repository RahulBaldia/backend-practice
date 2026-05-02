import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_BASE = 'http://localhost:3000'

const MOCK_RESULTS = {
  question: "What's your favorite programming language?",
  options: [
    { id: 'opt_0', text: 'JavaScript', votes: 18 },
    { id: 'opt_1', text: 'Python', votes: 14 },
    { id: 'opt_2', text: 'Rust', votes: 7 },
    { id: 'opt_3', text: 'Go', votes: 3 },
  ],
  expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
}

export default function ResultsPage() {
  const { id } = useParams()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/polls/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setResults(data)
      } catch {
        const stored = JSON.parse(localStorage.getItem('pollsnap_polls') || '{}')
        if (stored[id]) {
          const poll = stored[id]
          const options = poll.options.map((opt) => ({ ...opt, votes: opt.votes || 0 }))
          setResults({ ...poll, options })
        } else {
          setResults({ id, ...MOCK_RESULTS })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [id])

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="w-4 h-4 border-2 border-gray-300 border-t-violet-500 rounded-full animate-spin"></span>
            Loading results...
          </div>
        </div>
      </div>
    )
  }

  const isExpired = new Date(results.expiresAt) < new Date()
  const totalVotes = results.options.reduce((sum, o) => sum + (o.votes || 0), 0)
  const maxVotes = Math.max(...results.options.map((o) => o.votes || 0))
  const sorted = [...results.options].sort((a, b) => (b.votes || 0) - (a.votes || 0))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-gray-900 text-xl font-bold leading-snug">{results.question}</h2>
                <p className="text-gray-400 text-xs mt-1">
                  {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total
                </p>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isExpired
                    ? 'bg-gray-100 text-gray-400 border-gray-200'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}
              >
                {isExpired ? 'Expired' : '● Active'}
              </span>
            </div>

            {/* Results */}
            <div className="space-y-5 mb-6">
              {sorted.map((opt, i) => {
                const votes = opt.votes || 0
                const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
                const isLeader = votes === maxVotes && maxVotes > 0

                return (
                  <div key={opt.id}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span
                        className={`text-sm font-medium flex items-center gap-1.5 ${
                          isLeader ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {isLeader && i === 0 && totalVotes > 0 && (
                          <span className="text-yellow-500 text-base">🏆</span>
                        )}
                        {opt.text}
                      </span>
                      <span className="text-gray-400 text-xs tabular-nums">
                        {votes} {votes === 1 ? 'vote' : 'votes'} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isLeader && i === 0 ? 'bg-violet-500' : 'bg-gray-300'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Expiry detail */}
            <p className="text-gray-400 text-xs mb-5">
              {isExpired
                ? `Expired on ${new Date(results.expiresAt).toLocaleString()}`
                : `Active until ${new Date(results.expiresAt).toLocaleString()}`}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                {copied ? '✓ Link Copied!' : '🔗 Share Poll'}
              </button>
              <Link
                to="/"
                className="flex-1 text-center bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                New Poll
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
