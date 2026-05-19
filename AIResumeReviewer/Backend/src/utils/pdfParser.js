import pdfParse from 'pdf-parse-fork'

const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer)
    return data.text
  } catch (err) {
    console.error('PDF parsing error:', err)
    throw new Error('Failed to extract text from PDF')
  }
}

export default extractTextFromPDF