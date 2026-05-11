import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_BASE = 'http://localhost:3000'

export default function AllPolls() {
  const [polls, setPolls] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(null) // poll id to confirm

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('pollsnap_polls') || '{}')
    const list = Object.values(stored).sort(
      (a, b) => new Date(b.expiresAt) - new Date(a.expiresAt)
    )
    setPolls(list)
  }, [])

  const voted = JSON.parse(localStorage.getItem('pollsnap_voted') || '[]')

  const handleDelete = async (id) => {
    // Try backend delete
    try {
      await fetch(`${API_BASE}/api/polls/${id}`, { method: 'DELETE' })
    } catch {
      // Backend not running, proceed with localStorage only
    }

    // Remove from localStorage
    const stored = JSON.parse(localStorage.getItem('pollsnap_polls') || '{}')
    delete stored[id]
    localStorage.setItem('pollsnap_polls', JSON.stringify(stored))

    const votedList = JSON.parse(localStorage.getItem('pollsnap_voted') || '[]')
    localStorage.setItem('pollsnap_voted', JSON.stringify(votedList.filter((v) => v !== id)))

    setPolls((prev) => prev.filter((p) => p.id !== id))
    setConfirmDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">All Polls</h1>
          <p className="text-gray-400 text-sm mt-1">
            {polls.length} poll{polls.length !== 1 ? 's' : ''} created
          </p>
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🗳️</p>
            <p className="text-gray-500 font-medium mb-1">No polls yet</p>
            <p className="text-gray-400 text-sm mb-6">Create your first poll to get started</p>
            <Link
              to="/"
              className="inline-block bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              + Create Poll
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {polls.map((poll) => {
              const isExpired = new Date(poll.expiresAt) < new Date()
              const hasVoted = voted.includes(poll.id)
              const isConfirming = confirmDelete === poll.id

              return (
                <div
                  key={poll.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <p className="text-gray-900 font-semibold text-base leading-snug flex-1">
                      {poll.question}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          isExpired
                            ? 'bg-gray-100 text-gray-400 border-gray-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}
                      >
                        {isExpired ? 'Expired' : '● Active'}
                      </span>
                      <button
                        onClick={() => setConfirmDelete(isConfirming ? null : poll.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50"
                        title="Delete poll"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Inline delete confirmation */}
                  {isConfirming && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3">
                      <p className="text-red-600 text-sm font-medium">Delete this poll?</p>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(poll.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                        >
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <span>{poll.options.length} options</span>
                    <span>·</span>
                    <span>
                      {isExpired
                        ? `Expired ${new Date(poll.expiresAt).toLocaleDateString()}`
                        : `Expires ${new Date(poll.expiresAt).toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {!isExpired && !hasVoted ? (
                      <Link
                        to={`/poll/${poll.id}`}
                        className="flex-1 text-center bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2 rounded-xl transition-colors"
                      >
                        Vote
                      </Link>
                    ) : null}
                    <Link
                      to={`/results/${poll.id}`}
                      className={`text-center border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 rounded-xl transition-colors ${
                        isExpired || hasVoted ? 'flex-1' : 'px-5'
                      }`}
                    >
                      {hasVoted ? 'See Your Results' : 'Results'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
