const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    completed: {
        type: Boolean,
        default: false  // 👈 ye missing tha!
    }
}, { timestamps: true }); // 👈 createdAt & updatedAt automatic

const todoModel = mongoose.model("todos", todoSchema);

module.exports = todoModel;