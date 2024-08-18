// models/User.js (MySQL example)
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'expense_tracker_uno',
  password: 'derniermetro000.'
});

exports.create = async (user) => {
  const { name, email, password } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const [results] = await pool.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return results;
};

exports.findByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0]; // Return the first result
};
