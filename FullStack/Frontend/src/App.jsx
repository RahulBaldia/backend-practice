import { useState, useEffect } from 'react'
import axios from "axios"

function App() {

  const [notes, setNotes] = useState([])

  useEffect(() => {
    axios.get("https://backend-practice-9ezm.onrender.com/notes")
      .then(res => {
        setNotes(res.data.notes)
      })
  }, [])

  const submitHandler = (e) => {
    e.preventDefault()

    const title = e.target.title.value
    const description = e.target.description.value

    axios.post("https://backend-practice-9ezm.onrender.com/notes", {
      title,
      description
    })
      .then(res => {
        setNotes([...notes, res.data.note])
        e.target.reset()
      })
  }

  const deleteHandler = async (id) => {
    await axios.delete(`https://backend-practice-9ezm.onrender.com/notes/${id}`)
    setNotes(notes.filter(note => note._id !== id))
  }

  const updateHandler = async (id) => {
    const newTitle = prompt("Enter new title")
    const newDescription = prompt("Enter new description")

    const res = await axios.patch(
      `https://backend-practice-9ezm.onrender.com/notes/${id}`,
      {
        title: newTitle,
        description: newDescription
      }
    )

    setNotes(
      notes.map(note =>
        note._id === id ? res.data.updatedNote : note
      )
    )
  }

  // 👇 Return MUST be inside function
  return (
    <>
      <form className='note-create-form' onSubmit={submitHandler}>
        <input name='title' type="text" placeholder='title' />
        <input name='description' type="text" placeholder='description' />
        <button>Create Note</button>
      </form>

      <div className='notes'>
        {notes.map(note => (
          <div className='note' key={note._id}>
            <h1>{note.title}</h1>
            <p>{note.description}</p>
            <button onClick={() => deleteHandler(note._id)}>
              Delete
            </button>
            <button onClick={() => updateHandler(note._id)}>
              Update
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default App