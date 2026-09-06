/**
 * MySQL Connection Pool
 * Uses mysql2 with promise support for async/await queries.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'smart_education',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Enable multiple statements for schema init
  multipleStatements: true,
});

module.exports = pool;
