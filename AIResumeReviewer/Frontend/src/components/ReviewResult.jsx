import { useEffect, useRef } from 'react'

function ScoreBar({ score, color }) {
  const barRef = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      if (barRef.current) barRef.current.style.width = score + '%'
    }, 200)
  }, [score])

  return (
    <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{ background: '#1c1c27' }}>
      <div ref={barRef} className="h-full rounded-full transition-all duration-[1400ms] ease-out"
        style={{ width: '0%', background: color }} />
    </div>
  )
}

function ReviewResult({ data, onReset }) {
  const scoreRef = useRef(null)
  const barRef = useRef(null)

  // Animate ATS score counter
  useEffect(() => {
    let cur = 0
    const target = data.ats_score
    const timer = setInterval(() => {
      cur = Math.min(cur + 2, target)
      if (scoreRef.current) scoreRef.current.textContent = cur
      if (cur >= target) clearInterval(timer)
    }, 18)
    return () => clearInterval(timer)
  }, [data.ats_score])

  // Animate ATS bar
  useEffect(() => {
    setTimeout(() => {
      if (barRef.current) barRef.current.style.width = data.ats_score + '%'
    }, 100)
  }, [data.ats_score])

  const getScoreTag = (score) => {
    if (score >= 80) return { label: '✦ ATS Friendly', bg: 'rgba(67,232,158,0.1)', color: '#43e89e', border: 'rgba(67,232,158,0.2)' }
    if (score >= 60) return { label: '⚡ Needs Improvement', bg: 'rgba(255,193,7,0.1)', color: '#ffc107', border: 'rgba(255,193,7,0.2)' }
    return { label: '✕ Low ATS Match', bg: 'rgba(255,101,132,0.1)', color: '#ff6584', border: 'rgba(255,101,132,0.2)' }
  }

  const tag = getScoreTag(data.ats_score)

  const sectionColors = {
    high: 'linear-gradient(90deg,#43e89e,#1fd07e)',
    mid: 'linear-gradient(90deg,#ffc107,#ff9f0a)',
    low: 'linear-gradient(90deg,#ff6584,#ff3860)',
  }

  const getBarColor = (score) => {
    if (score >= 70) return sectionColors.high
    if (score >= 45) return sectionColors.mid
    return sectionColors.low
  }

  return (
    <div className="animate-[fadeUp_0.5s_ease_both]">

      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <h2 className="text-2xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>
          Analysis Complete ✦
        </h2>
        <button onClick={onReset}
          className="text-sm px-4 py-2 rounded-xl border text-[#7a7a9a] hover:text-[#f0f0ff] hover:border-[#6c63ff] transition-all duration-200"
          style={{ background: '#1c1c27', borderColor: '#2a2a3d' }}>
          ← Analyze Another
        </button>
      </div>

      {/* ATS Score Card */}
      <div className="relative rounded-2xl p-8 mb-5 overflow-hidden"
        style={{ background: '#13131a', border: '1px solid #2a2a3d' }}>
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(108,99,255,0.12), transparent 70%)' }} />

        <p className="text-xs uppercase tracking-widest text-[#7a7a9a] font-medium mb-3">
          ATS Compatibility Score
        </p>

        <div className="flex items-end gap-2 mb-5">
          <span ref={scoreRef} className="text-7xl font-extrabold leading-none"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            0
          </span>
          <span className="text-xl text-[#7a7a9a] mb-3">/100</span>
        </div>

        {/* Score Progress Bar */}
        <div className="rounded-full h-2 overflow-hidden mb-3" style={{ background: '#1c1c27' }}>
          <div ref={barRef} className="h-full rounded-full transition-all duration-[1200ms] ease-out"
            style={{
              width: '0%',
              background: 'linear-gradient(90deg, #6c63ff, #ff6584)'
            }} />
        </div>

        {/* Score Tag */}
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
          style={{ background: tag.bg, color: tag.color, borderColor: tag.border }}>
          {tag.label}
        </span>
      </div>

      {/* Strengths + Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Strengths */}
        <div className="rounded-2xl p-6" style={{ background: '#13131a', border: '1px solid #2a2a3d' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: 'rgba(67,232,158,0.12)', border: '1px solid rgba(67,232,158,0.2)' }}>
              ✅
            </div>
            <h3 className="font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>Strengths</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#7a7a9a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43e89e] flex-shrink-0 mt-1.5" />
                <span className="text-[#f0f0ff]">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps */}
        <div className="rounded-2xl p-6" style={{ background: '#13131a', border: '1px solid #2a2a3d' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: 'rgba(255,101,132,0.12)', border: '1px solid rgba(255,101,132,0.2)' }}>
              ⚠️
            </div>
            <h3 className="font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>Missing / Weak Areas</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {data.gaps.map((g, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6584] flex-shrink-0 mt-1.5" />
                <span className="text-[#f0f0ff]">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section Scores */}
      <div className="rounded-2xl p-6 mb-4" style={{ background: '#13131a', border: '1px solid #2a2a3d' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)' }}>
            📊
          </div>
          <h3 className="font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>Section-wise Score</h3>
        </div>
        <div className="flex flex-col gap-4">
          {data.section_scores.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm text-[#7a7a9a] w-36 flex-shrink-0">{s.name}</span>
              <ScoreBar score={s.score} color={getBarColor(s.score)} />
              <span className="text-xs text-[#7a7a9a] w-9 text-right">{s.score}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ATS Keywords */}
      <div className="rounded-2xl p-6 mb-4" style={{ background: '#13131a', border: '1px solid #2a2a3d' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{ background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.2)' }}>
            🔑
          </div>
          <h3 className="font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>ATS Keywords</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.keywords.found.map((k, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(67,232,158,0.1)',
                color: '#43e89e',
                border: '1px solid rgba(67,232,158,0.2)'
              }}>
              {k}
            </span>
          ))}
          {data.keywords.missing.map((k, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium line-through opacity-60"
              style={{
                background: 'rgba(255,101,132,0.08)',
                color: '#ff6584',
                border: '1px solid rgba(255,101,132,0.2)'
              }}>
              {k}
            </span>
          ))}
        </div>
        <p className="text-xs text-[#7a7a9a] mt-3">
          <span className="text-[#43e89e]">Green</span> = found in your resume ·{' '}
          <span className="text-[#ff6584]">Red strikethrough</span> = missing
        </p>
      </div>

      {/* Improvements */}
      <div className="rounded-2xl p-6" style={{ background: '#13131a', border: '1px solid #2a2a3d' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)' }}>
            💡
          </div>
          <h3 className="font-bold text-base" style={{ fontFamily: "'Syne', sans-serif" }}>How to Improve</h3>
        </div>
        <div className="flex flex-col gap-3">
          {data.improvements.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl text-sm leading-relaxed"
              style={{
                background: '#1c1c27',
                borderLeft: '3px solid #6c63ff'
              }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: 'rgba(108,99,255,0.12)',
                  color: '#6c63ff'
                }}>
                {i + 1}
              </div>
              <p className="text-[#f0f0ff]">
                <strong className="text-[#6c63ff] font-semibold">{item.bold} — </strong>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default ReviewResult