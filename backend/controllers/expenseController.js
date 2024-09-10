const Expense = require('../models/Expense');

// Controller to create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, date } = req.body;
    const user_id = req.session.user.id; // Ensure req.session.user is populated correctly

    // Validate input
    if (!title || !amount || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create a new expense
    const result = await Expense.create({ user_id, title, amount, date });
    res.status(201).json({ message: 'Expense added successfully', result });
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: err.message });
  }
};

// Controller to get all expenses for the authenticated user
exports.getExpenses = async (req, res) => {
  try {
    const user_id = req.session.user.id; // Ensure req.session.user is populated correctly

    // Fetch expenses by user ID
    const expenses = await Expense.findAllByUserId(user_id);
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: err.message });
  }
};
