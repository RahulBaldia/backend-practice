const express = require('express');
const todoModel = require('../models/todo.model.js');
const todoRouter = express.Router();

// GET all todos
todoRouter.get('/getTodos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.status(200).json({ message: "Todos fetched successfully", todos });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// POST create todo
todoRouter.post('/createTodo', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTodo = await todoModel.create({ title, description });
        res.status(201).json({ message: "Todo Created Successfully", newTodo });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// PATCH update todo
todoRouter.patch('/updateTodo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id, req.body, { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Todo Updated Successfully", updatedTodo });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// DELETE todo
todoRouter.delete('/deleteTodo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await todoModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Todo Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = todoRouter;