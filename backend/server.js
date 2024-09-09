const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./config/db');
const authRoutes = require('./routes/auth.js');
const expenseRoutes = require('./routes/expenses.js');

const app = express();
app.use(express.json()); // Middleware for parsing JSON bodies

// Unified CORS configuration
const corsOptions = {
    origin: 'https://the-001-finance-manager.netlify.app', // Your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true, // Enable credentials (cookies)
};

app.use(cors(corsOptions)); // Apply CORS configuration to all routes
app.options('*', cors(corsOptions)); // Handle preflight requests

// Session configuration
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'chapaifahm098',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 60 * 60 * 1000, // 1 hour
    },
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized: No session available' });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', isAuthenticated, expenseRoutes);

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

        // Set user session
        req.session.user = { id: user.id, name: user.name, email: user.email };
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

// Route to logout a user
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Route to fetch expenses (requires authentication)
app.get('/api/expenses', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM expenses WHERE user_id = ?', [req.session.user.id]);
        res.json(rows.map(expense => ({
            ...expense,
            date: new Date(expense.date).toISOString()
        })));
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'An error occurred while fetching expenses.' });
    }
});

// Route to add an expense (requires authentication)
app.post('/api/expenses', async (req, res) => {
    const { title, amount, date } = req.body;
    if (!title || !amount || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO expenses (title, amount, date, user_id) VALUES (?, ?, ?, ?)',
            [title, amount, date, req.session.user.id]
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
