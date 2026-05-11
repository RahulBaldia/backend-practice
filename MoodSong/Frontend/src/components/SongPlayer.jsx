import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const SongPlayer = ({ mood }) => {

  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!mood) return
    axios.get(`http://localhost:3000/songs/${mood}`)
      .then(res => {
        setSongs(res.data.songs)
      })
  }, [mood])

  useEffect(() => {
    if (songs.length > 0 && audioRef.current) {
      audioRef.current.src = songs[0].url
      audioRef.current.play()
      setCurrentSong(songs[0].id)
      setIsPlaying(true)
    }
  }, [songs])

  const playSong = (song) => {
    audioRef.current.src = song.url
    audioRef.current.play()
    setCurrentSong(song.id)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const playNext = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong)
    const nextIndex = (currentIndex + 1) % songs.length
    playSong(songs[nextIndex])
  }

  const playPrev = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong)
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length
    playSong(songs[prevIndex])
  }

  const iconColors = {
    happy: 'bg-green-100 text-green-700',
    sad: 'bg-blue-100 text-blue-700',
    neutral: 'bg-gray-100 text-gray-600',
  }

  const currentSongData = songs.find(s => s.id === currentSong)

  return (
    <div>
      <audio ref={audioRef} onEnded={playNext} />

      {/* Now Playing Bar */}
      {currentSongData && (
        <div className="bg-white rounded-2xl border border-gray-200 px-4 py-4 mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Now playing</p>
          <p className="text-sm font-medium text-gray-800 mb-3">{currentSongData.name}</p>

          {/* Controllers */}
          <div className="flex items-center justify-center gap-6">
            <button onClick={playPrev} className="text-gray-500 hover:text-gray-800 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
              </svg>
            </button>

            <button
              onClick={togglePlayPause}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            <button onClick={playNext} className="text-gray-500 hover:text-gray-800 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Songs List */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        Songs for your mood
      </p>

      <div className="flex flex-col gap-3">
        {songs.map((song) => (
          <div
            key={song.id}
            className={`bg-white rounded-2xl border px-4 py-3 flex items-center gap-4 cursor-pointer transition-all ${currentSong === song.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => playSong(song)}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[mood]}`}>
              {currentSong === song.id && isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{song.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{mood}</p>
            </div>

            {currentSong === song.id && (
              <span className="text-xs text-blue-600 font-medium">Playing</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SongPlayer