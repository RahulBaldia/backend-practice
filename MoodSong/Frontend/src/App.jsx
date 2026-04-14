import Camera from './components/Camera'
import SongPlayer from './components/SongPlayer'
import { useState } from 'react'

const App = () => {
  const [mood, setMood] = useState('')

  const moodBadge = {
    happy: 'bg-green-100 text-green-700',
    sad: 'bg-blue-100 text-blue-700',
    neutral: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-medium text-gray-800">Mood Music</h1>
          <p className="text-sm text-gray-500 mt-1">Songs that match how you feel</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <Camera setMood={setMood} />
          <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-3">
            <span className="text-sm text-gray-500">Detected mood</span>
            {mood ? (
              <span className={`text-xs font-medium px-3 py-1 rounded-lg ${moodBadge[mood]}`}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </span>
            ) : (
              <span className="text-xs text-gray-400">Detecting...</span>
            )}
          </div>
        </div>

        <SongPlayer mood={mood} />
      </div>
    </div>
  )
}

export default App