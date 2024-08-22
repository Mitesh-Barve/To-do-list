const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');  // Include the 'path' module for serving static files
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todos')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Define the Todo schema and model
const TodoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
});

const Todo = mongoose.model('Todo', TodoSchema);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Get all todos
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

// Add a new todo
app.post('/todos', async (req, res) => {
    const newTodo = new Todo({
        task: req.body.task,
        completed: false,
    });
    await newTodo.save();
    res.json(newTodo);
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    todo.completed = req.body.completed;
    await todo.save();
    res.json(todo);
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
});

// Handle any other routes by serving the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
