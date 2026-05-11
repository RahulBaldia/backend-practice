import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_BASE = 'http://localhost:3000'

export default function VotePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [poll, setPoll] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const voted = JSON.parse(localStorage.getItem('pollsnap_voted') || '[]')
    if (voted.includes(id)) {
      navigate(`/results/${id}`, { replace: true })
      return
    }

    const fetchPoll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/polls/${id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setPoll(data)
      } catch {
        const stored = JSON.parse(localStorage.getItem('pollsnap_polls') || '{}')
        if (stored[id]) {
          setPoll(stored[id])
        } else {
          setError('Poll not found.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPoll()
  }, [id, navigate])

  const isExpired = poll && new Date(poll.expiresAt) < new Date()

  const handleVote = async () => {
    if (!selected || voting) return
    setVoting(true)
    try {
      const res = await fetch(`${API_BASE}/api/polls/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: selected }),
      })
      if (!res.ok) throw new Error('Vote failed')
    } catch {
      const stored = JSON.parse(localStorage.getItem('pollsnap_polls') || '{}')
      if (stored[id]) {
        const updated = {
          ...stored[id],
          options: stored[id].options.map((opt) => ({
            ...opt,
            votes: (opt.votes || 0) + (opt.id === selected ? 1 : 0),
          })),
        }
        stored[id] = updated
        localStorage.setItem('pollsnap_polls', JSON.stringify(stored))
      }
    }

    const voted = JSON.parse(localStorage.getItem('pollsnap_voted') || '[]')
    voted.push(id)
    localStorage.setItem('pollsnap_voted', JSON.stringify(voted))
    navigate(`/results/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="w-4 h-4 border-2 border-gray-300 border-t-violet-500 rounded-full animate-spin"></span>
            Loading poll...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32 px-4">
          <div className="text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-900 font-semibold mb-2">Poll Not Found</p>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <Link to="/" className="text-violet-600 hover:text-violet-500 text-sm transition-colors">
              ← Create a poll
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {isExpired ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">⏰</div>
                <h2 className="text-gray-900 text-xl font-bold mb-2">Poll Expired</h2>
                <p className="text-gray-500 text-sm mb-6">
                  This poll is no longer accepting votes.
                </p>
                <button
                  onClick={() => navigate(`/results/${id}`)}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
                >
                  See Results →
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-gray-900 text-2xl font-bold leading-snug">{poll.question}</h2>
                  <p className="text-gray-400 text-xs mt-1.5">
                    Expires {new Date(poll.expiresAt).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {poll.options.map((opt) => {
                    const isSelected = selected === opt._id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelected(opt._id)}
                        className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center gap-3 text-sm font-medium ${
                          isSelected
                            ? 'bg-violet-50 border-violet-400 text-violet-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                            isSelected ? 'border-violet-500 bg-violet-500' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <span className="w-1.5 h-1.5 bg-white rounded-full block" />
                          )}
                        </span>
                        {opt.text}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={handleVote}
                  disabled={!selected || voting}
                  className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {voting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Submitting...
                    </span>
                  ) : (
                    'Vote'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
