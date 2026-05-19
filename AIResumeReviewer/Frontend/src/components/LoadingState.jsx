import { useState, useEffect } from 'react'

const STEPS = [
  'Extracting resume text',
  'Scanning for ATS keywords',
  'Evaluating section quality',
  'Generating improvements',
]

function LoadingState() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 900)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center py-16 px-6 animate-[fadeUp_0.4s_ease_both]">

      {/* Spinner */}
      <div className="w-14 h-14 mx-auto mb-6 rounded-full animate-spin"
        style={{
          border: '3px solid rgba(108,99,255,0.15)',
          borderTopColor: '#6c63ff'
        }}
      />

      <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
        Analyzing your resume...
      </h2>
      <p className="text-[#7a7a9a] text-sm">Gemini AI is reading through your content</p>

      {/* Steps */}
      <div className="mt-8 flex flex-col gap-3 max-w-xs mx-auto text-left">
        {STEPS.map((step, i) => (
          <div key={i} className={`flex items-center gap-3 text-sm transition-colors duration-300
            ${i < activeStep ? 'text-[#43e89e]' : i === activeStep ? 'text-[#f0f0ff]' : 'text-[#7a7a9a]'}`}>

            {/* Dot */}
            <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300
              ${i < activeStep ? 'bg-[#43e89e]' : i === activeStep
                ? 'bg-[#43e89e] shadow-[0_0_8px_#43e89e]'
                : 'bg-[#2a2a3d]'}`}
            />

            {/* Text */}
            <span>{step}</span>

            {/* Checkmark */}
            {i < activeStep && (
              <svg className="w-3.5 h-3.5 ml-auto text-[#43e89e]" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LoadingState