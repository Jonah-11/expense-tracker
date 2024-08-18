const Expense = require('../models/Expense');

exports.createExpense = (req, res) => {
  const { title, amount, date } = req.body;
  const user_id = req.user.id;

  Expense.create({ user_id, title, amount, date }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({ message: 'Expense added successfully' });
  });
};

exports.getExpenses = (req, res) => {
  const user_id = req.user.id;

  Expense.findAllByUserId(user_id, (err, expenses) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(expenses);
  });
};
