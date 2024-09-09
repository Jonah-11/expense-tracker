const mysql = require('mysql2/promise');
require("dotenv").config();

const urlDB = `mysql://$root:FonhDsYjtYDarXOeATpnhsDSCvUHNPyO@mysql.railway.internal:3306/railway`

const pool = mysql.createPool(urlDB);

module.exports = pool;
