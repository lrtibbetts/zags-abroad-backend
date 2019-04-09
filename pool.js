const mySQL = require('mysql');
require('dotenv').config();

const pool = mySQL.createPool({
  connectionLimit: 100,
  host: process.env.POOL_HOST,
  user: process.env.POOL_USER,
  password: process.env.POOL_PASSWORD,
  database: process.env.POOL_DATABASE
});

module.exports = pool;
