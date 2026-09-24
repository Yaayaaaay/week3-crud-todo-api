require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

let todos = [
    { id: 1, task: 'Learn node.js', completed: false },
    { id: 2, task: 'Building CRUD', completed: false },
    { id: 3, task: 'Deploying CRUD', completed: true }
];

// READ ALL: GET /todos
app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

// BONUS ROUTE: GET /todos/active (must be placed BEFORE /todos/:id)
app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter(todo => !todo.completed);
    res.status(200).json(activeTodos);
});

// READ SINGLE: GET /todos/:id
app.get('/todos/:id', (req, res) => {
    const todo = todos.find(item => item.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json(todo);
});

// CREATE: POST /todos (with validation)
app.post('/todos', (req, res) => {
    const { task, completed = false } = req.body;

    // Validation requirement: task field must exist
    if (!task || typeof task !== 'string' || task.trim() === '') {
        return res.status(400).json({ error: 'The "task" field is required.' });
    }

    const nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    const newTodo = { id: nextId, task: task.trim(), completed };
    
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// UPDATE: PATCH /todos/:id
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find(item => item.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    Object.assign(todo, req.body);
    res.status(200).json(todo);
});

// DELETE: DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
    const initLength = todos.length;
    todos = todos.filter(item => item.id !== parseInt(req.params.id));
    
    if (initLength === todos.length) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});