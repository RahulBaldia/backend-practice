// Server ko create and config karna 

const express = require("express")
const noteModel = require('./models/note.model.js')

const app = express();
app.use(express.json())


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
    const { description } = req.body;

    const updatedNote = await noteModel.findByIdAndUpdate(
        id,
        { description },
        { new: true }
    );

    res.status(200).json({
        message: "Description Updated Successfully",
        updatedNote
    });
});

module.exports = app