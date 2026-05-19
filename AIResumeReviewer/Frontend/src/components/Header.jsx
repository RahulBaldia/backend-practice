function Header() {
  return (
    <div className="text-center mb-14 animate-[fadeUp_0.6s_ease_both]">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
        style={{
          background: 'rgba(108,99,255,0.12)',
          borderColor: 'rgba(108,99,255,0.3)',
          color: '#6c63ff'
        }}>
        <span className="w-2 h-2 rounded-full bg-[#43e89e] animate-pulse" />
        <span className="text-xs font-medium tracking-wide">AI Powered · Gemini</span>
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4"
        style={{ fontFamily: "'Syne', sans-serif" }}>
        Resume{' '}
        <span style={{
          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Reviewer
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-[#7a7a9a] text-base font-light max-w-md mx-auto leading-relaxed">
        Upload your resume and get instant AI feedback —
        ATS score, strengths, gaps & improvements.
      </p>
    </div>
  )
}

export default Header