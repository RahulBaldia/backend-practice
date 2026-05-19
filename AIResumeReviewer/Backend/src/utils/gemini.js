import Groq from 'groq-sdk'
import dotenv from 'dotenv'

dotenv.config()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const analyzeResume = async (resumeText) => {
  const prompt = `
You are an expert ATS (Applicant Tracking System) resume reviewer and career coach.
Analyze the following resume text and return a JSON response ONLY — no explanation, no markdown, just raw JSON.

Resume Text:
"""
${resumeText}
"""

Return this exact JSON structure:
{
  "ats_score": <number between 0-100>,
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>",
    "<strength 4>"
  ],
  "gaps": [
    "<gap 1>",
    "<gap 2>",
    "<gap 3>",
    "<gap 4>"
  ],
  "section_scores": [
    { "name": "Work Experience", "score": <0-100> },
    { "name": "Skills", "score": <0-100> },
    { "name": "Projects", "score": <0-100> },
    { "name": "Education", "score": <0-100> },
    { "name": "Summary", "score": <0-100> },
    { "name": "Achievements", "score": <0-100> }
  ],
  "keywords": {
    "found": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>", "<keyword6>", "<keyword7>", "<keyword8>"],
    "missing": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>", "<keyword6>"]
  },
  "improvements": [
    { "bold": "<short title>", "text": "<detailed suggestion>" },
    { "bold": "<short title>", "text": "<detailed suggestion>" },
    { "bold": "<short title>", "text": "<detailed suggestion>" },
    { "bold": "<short title>", "text": "<detailed suggestion>" },
    { "bold": "<short title>", "text": "<detailed suggestion>" }
  ]
}

Rules:
- Be honest and critical
- ATS score should reflect real ATS compatibility
- Keywords found must actually exist in the resume
- Missing keywords should be relevant to the person's field
- Improvements must be specific and actionable
- Return ONLY the JSON object, nothing else
`

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0].message.content

    // Clean response — remove markdown backticks if added
    const cleaned = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const parsed = JSON.parse(cleaned)
    return parsed

  } catch (err) {
    console.error('Groq API error:', err)
    throw new Error('Failed to analyze resume with AI')
  }
}

export default analyzeResume