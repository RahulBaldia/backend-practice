const express = require('express');
const cors = require('cors');          // 👈 add this
const todoRoutes = require('./routes/todo.routes.js');

const app = express();

app.use(cors());                        // 👈 add this
    app.use(express.json());
    app.use('/api/todos', todoRoutes);

module.exports = app;