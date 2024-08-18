// models/Expense.js (MySQL example)
const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'expense_tracker_uno',
  password: 'derniermetro000.'
});

exports.create = async (expense) => {
  const { user_id, title, amount, date } = expense;
  const [results] = await pool.execute(
    'INSERT INTO expenses (user_id, title, amount, date) VALUES (?, ?, ?, ?)',
    [user_id, title, amount, date]
  );
  return results;
};

exports.findAllByUserId = async (user_id) => {
  const [rows] = await pool.execute('SELECT * FROM expenses WHERE user_id = ?', [user_id]);
  return rows;
};
