import express from 'express'
import multer from 'multer'
import extractTextFromPDF from '../utils/pdfParser.js'
import analyzeResume from '../utils/gemini.js'

const router = express.Router()

// Multer setup — memory mein rakho
const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files allowed!'), false)
    }
  }
})

// POST /api/review
router.post('/review', upload.single('resume'), async (req, res) => {

  try {
    // Step 1 — File aai ki nahi check karo
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded. Please upload a PDF.'
      })
    }

    console.log('📄 File received:', req.file.originalname)

    // Step 2 — PDF se text nikalo
    const resumeText = await extractTextFromPDF(req.file.buffer)

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        error: 'Could not extract text from PDF. Make sure it is not a scanned image.'
      })
    }

    console.log('✅ Text extracted — length:', resumeText.length)

    // Step 3 — Gemini se analyze karao
    const reviewData = await analyzeResume(resumeText)

    console.log('🤖 Groq analysis done!')

    // Step 4 — Frontend ko bhejo
    res.status(200).json(reviewData)

  } catch (err) {
    console.error('❌ Error:', err.message)
    res.status(500).json({
      error: err.message || 'Something went wrong. Please try again.'
    })
  }
})

export default router