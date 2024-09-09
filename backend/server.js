const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const db = require('./config/db');
const authRoutes = require('./routes/auth.js');
const expenseRoutes = require('./routes/expenses.js');

app.use(express.json()); // Middleware for parsing JSON bodies

// Unified CORS configuration
const corsOptions = {
    origin: ['https://the-001-finance-manager.netlify.app/'], // Add more origins as needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS configuration to all routes
app.options('*', cors(corsOptions)); // Handle preflight requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Route to register a new user
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'An error occurred while registering the user.' });
    }
});

// Route to login a user
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

// Route to fetch expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM expenses');
        res.json(rows.map(expense => ({
            ...expense,
            date: new Date(expense.date).toISOString()
        })));
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'An error occurred while fetching expenses.' });
    }
});

// Route to add an expense
app.post('/api/expenses', async (req, res) => {
    const { title, amount, date } = req.body;
    if (!title || !amount || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO expenses (title, amount, date) VALUES (?, ?, ?)',
            [title, amount, date]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error('Error adding expense:', err);
        res.status(500).json({ error: 'An error occurred while adding the expense.' });
    }
});

// Set the server to listen on the provided port, or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
