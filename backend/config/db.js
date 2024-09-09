const mysql = require('mysql2/promise');
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql.railway.internal',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'TwxzBfuunzLHLbdqdtVQIkJzozhRFbLQ',
  database: process.env.MYSQL_DATABASE || 'railway',
});

module.exports = pool;
