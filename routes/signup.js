const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Import the database connection

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { phone_number, email, password } = req.body;

        // Validation
        if (!phone_number || !email || !password) {
            return res.status(400).json({ error: 'All fields are required (phone number, email, password).' });
        }
        if (!/^\d{10}$/.test(phone_number)) {
            return res.status(400).json({ error: 'Phone number must be exactly 10 digits.' });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check for duplicates
        const checkQuery = 'SELECT * FROM users WHERE phone_number = ? OR gmail = ?';
        db.query(checkQuery, [phone_number, email], (checkErr, results) => {
            if (checkErr) {
                console.error('Database error:', checkErr);
                return res.status(500).json({ error: 'Database error.' });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'Phone number or email already exists.' });
            }

            // Insert new user
            const insertQuery = 'INSERT INTO users (phone_number, gmail, password, wallet_balance) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [phone_number, email, hashedPassword, 0], (insertErr) => {
                if (insertErr) {
                    console.error('Database error:', insertErr);
                    return res.status(500).json({ error: 'Failed to register user.' });
                }
                res.status(201).json({ success: true, message: 'User registered successfully!' });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
