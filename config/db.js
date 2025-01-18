require('dotenv').config(); // Load environment variables
const mysql = require('mysql');
const chalk = require('chalk');

// Create a MySQL connection pool
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'gaming_app',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error(chalk.red('Database connection failed:', err.message));
        return setTimeout(() => db.connect(), 5000); // Retry connection
    }
    console.log(chalk.blue('Connected to MySQL Database!'));
});

module.exports = db;
