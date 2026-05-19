import { useState, useRef } from 'react'

function UploadZone({ onAnalyze }) {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      alert('Please upload a PDF file only.')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      alert('File too large. Max size is 5MB.')
      return
    }
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }

  const removeFile = () => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="animate-[fadeUp_0.6s_0.1s_ease_both]">

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current.click()}
        className={`
          relative rounded-2xl p-14 text-center cursor-pointer
          border-2 border-dashed transition-all duration-300 overflow-hidden
          ${dragging
            ? 'border-[#6c63ff] bg-[rgba(108,99,255,0.06)]'
            : 'border-[#2a2a3d] bg-[#13131a] hover:border-[#6c63ff] hover:bg-[rgba(108,99,255,0.04)]'
          }
        `}
      >
        {/* Radial glow on hover */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.08) 0%, transparent 70%)',
            opacity: dragging ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        />

        {/* Upload Icon */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,101,132,0.1))',
            border: '1px solid rgba(108,99,255,0.2)'
          }}>
          <svg className="w-9 h-9 text-[#6c63ff]" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
          Drop your resume here
        </h2>
        <p className="text-[#7a7a9a] text-sm mb-6">or click to browse from your device</p>

        {/* Browse Button */}
        <button
          onClick={(e) => { e.stopPropagation(); inputRef.current.click() }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
            boxShadow: '0 4px 20px rgba(108,99,255,0.3)'
          }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Choose PDF File
        </button>

        <p className="mt-4 text-[#7a7a9a] text-xs">Supports PDF · Max 5MB</p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* File Selected Card */}
      {file && (
        <div className="mt-4 flex items-center gap-4 px-5 py-4 rounded-2xl border animate-[fadeUp_0.3s_ease_both]"
          style={{ background: '#1c1c27', borderColor: '#2a2a3d' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(67,232,158,0.1)',
              border: '1px solid rgba(67,232,158,0.2)'
            }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
              stroke="#43e89e" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-[#7a7a9a]">{(file.size / 1024).toFixed(0)} KB</p>
          </div>

          <button onClick={removeFile}
            className="text-[#7a7a9a] hover:text-[#ff6584] transition-colors p-1 rounded-lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Analyze Button */}
      {file && (
        <button
          onClick={() => onAnalyze(file)}
          className="w-full mt-4 py-4 rounded-2xl text-white font-bold text-base tracking-wide transition-all duration-300 hover:-translate-y-1 relative overflow-hidden animate-[fadeUp_0.3s_ease_both]"
          style={{
            fontFamily: "'Syne', sans-serif",
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            boxShadow: '0 6px 30px rgba(108,99,255,0.35)'
          }}>
          <span className="relative z-10">✦ Analyze My Resume</span>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }}
          />
        </button>
      )}
    </div>
  )
}

export default UploadZone