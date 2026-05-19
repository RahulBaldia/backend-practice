import { useState } from 'react'
import Header from './components/Header'
import UploadZone from './components/UploadZone'
import LoadingState from './components/LoadingState'
import ReviewResult from './components/ReviewResult'

function App() {
  const [appState, setAppState] = useState('upload')
  // states: 'upload' | 'loading' | 'result'
  const [reviewData, setReviewData] = useState(null)

  const handleAnalyze = async (file) => {
    setAppState('loading')

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const res = await fetch('/api/review', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setReviewData(data)
      setAppState('result')

    } catch (err) {
      console.error('Error:', err)
      alert('Something went wrong! Make sure backend is running.')
      setAppState('upload')
    }
  }

  const handleReset = () => {
    setReviewData(null)
    setAppState('upload')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0ff] font-sans relative">

      {/* BG Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(108,99,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,99,255,.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 pb-20">
        <Header />

        {appState === 'upload' && (
          <UploadZone onAnalyze={handleAnalyze} />
        )}

        {appState === 'loading' && (
          <LoadingState />
        )}

        {appState === 'result' && reviewData && (
          <ReviewResult data={reviewData} onReset={handleReset} />
        )}
      </div>
    </div>
  )
}

export default App