const mysql = require('mysql2/promise');
require("dotenv").config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'derniermetro000.',
  database: 'expense_tracker_uno'
});

module.exports = pool;
