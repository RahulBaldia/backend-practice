// Create and config the Server here...

const express = require("express")

const app = express()
app.use(express.json())

const notes = []

app.post('/notes', (req, res) => {
    console.log(req.body)
    notes.push(req.body)
    res.status(201).json({
        message: "Note Created Successfully"
    })
})


app.get('/notes', (req, res) => {
    console.log(notes);
    res.status(200).json({
        notes: notes
    })
})

app.delete('/notes/:index', (req, res) => {
    delete notes[req.params.index]
    res.status(200).json({
        message: "Note Deleted"
    })

})

app.patch('/notes/:index', (req, res) => {
    notes[req.params.index].description = req.body.description
    res.status(200).json({
        message: "Note Updated"
    })
})

module.exports = app