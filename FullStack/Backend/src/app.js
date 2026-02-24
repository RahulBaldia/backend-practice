// Server ko create and config karna 

const express = require("express")
const noteModel = require('./models/note.model.js')
const cors = require("cors")
const path = require("path");

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")));
    


app.post('/notes', async (req, res) => {
    const { title, description } = req.body;

    const note = await noteModel.create({
        title,
        description
    });

    res.status(201).json({
        message: "Note Created Successfully",
        note
    });
});

app.get('/notes', async (req, res) => {
    const notes = await noteModel.find();

    res.status(200).json({
        message: "Notes fetched successfully",
        notes
    });
});

app.delete('/notes/:id', async (req, res) => {
    const id = req.params.id
    await noteModel.findByIdAndDelete(id)
    res.status(200).json({
        message: "Note Deleted"
    })

})

app.patch("/notes/:id", async (req, res) => {
    const id = req.params.id;

    const updatedNote = await noteModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    );

    res.status(200).json({
        message: "Description Updated Successfully",
        updatedNote
    });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app