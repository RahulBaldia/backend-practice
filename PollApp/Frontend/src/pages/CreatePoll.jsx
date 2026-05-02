import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_BASE = 'http://localhost:3000'

const DURATIONS = [
  { label: '5 Minutes', value: '5m', ms: 5 * 60 * 1000 },
  { label: '30 Minutes', value: '30m', ms: 30 * 60 * 1000 },
  { label: '1 Hour', value: '1h', ms: 60 * 60 * 1000 },
  { label: '1 Day', value: '1d', ms: 24 * 60 * 60 * 1000 },
  { label: '7 Days', value: '7d', ms: 7 * 24 * 60 * 60 * 1000 },
]

export default function CreatePoll() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [duration, setDuration] = useState('1d')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addOption = () => {
    if (options.length < 5) setOptions([...options, ''])
  }

  const removeOption = (index) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index))
  }

  const updateOption = (index, value) => {
    const updated = [...options]
    updated[index] = value
    setOptions(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validOptions = options.filter((o) => o.trim())
    if (!question.trim()) return setError('Please enter a poll question.')
    if (validOptions.length < 2) return setError('Please add at least 2 options.')

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          options: validOptions,
          duration,
        }),
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      navigate(`/poll/${data._id}`)
    } catch {
      const dur = DURATIONS.find((d) => d.value === duration)
      const mockId = 'poll_' + Date.now()
      const mockPoll = {
        id: mockId,
        question: question.trim(),
        options: validOptions.map((text, i) => ({ id: `opt_${i}`, text })),
        expiresAt: new Date(Date.now() + dur.ms).toISOString(),
      }
      const stored = JSON.parse(localStorage.getItem('pollsnap_polls') || '{}')
      stored[mockId] = mockPoll
      localStorage.setItem('pollsnap_polls', JSON.stringify(stored))
      navigate(`/poll/${mockId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-gray-900 text-lg font-semibold mb-6">Create a New Poll</h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Question */}
            <div>
              <label className="block text-gray-500 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Poll Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you want to ask?"
                rows={2}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 resize-none transition-all"
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-gray-500 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Options <span className="text-gray-400 normal-case">({options.length} / 5)</span>
              </label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs w-4 text-right shrink-0">{i + 1}</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="text-gray-400 hover:text-red-400 transition-colors text-xl leading-none shrink-0 w-6"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 5 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-3 text-violet-600 hover:text-violet-500 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  + Add Option
                </button>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-gray-500 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-violet-500 transition-all cursor-pointer appearance-none"
              >
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-1"
            >
              {loading ? 'Creating...' : 'Create Poll →'}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}
