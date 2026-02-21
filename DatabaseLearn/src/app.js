// Server ko create and config karna 

const express = require("express")
const noteModel = require('./models/notes.model.js')

const app = express();
app.use(express.json())


app.post('/notes', async (req,res) =>{
    const{title,description} = req.body
    const note = await noteModel.create({
        title, description
    })

    res.status(201).json({
        message:"Note Created Successfully",
        note
    })
})

module.exports = app