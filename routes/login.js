const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Import the database connection

const router = express.Router();

router.post('/', (req, res) => {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
        return res.status(400).send('Phone number and password are required.');
    }

    const sql = 'SELECT * FROM users WHERE phone_number = ?';
    db.query(sql, [phone_number], async (err, results) => {
        if (err) {
            return res.status(500).send('Database error.');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid phone number or password.');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid phone number or password.');
        }

        // Check if there is already an active session
        if (user.session_id) {
            // Invalidate the previous session (log out the previous device)
            const updateSQL = 'UPDATE users SET session_id = NULL WHERE session_id = ?';
            db.query(updateSQL, [user.session_id], (err, result) => {
                if (err) {
                    return res.status(500).send('Failed to invalidate previous session.');
                }
            });
        }

        // Generate a new session ID (you could use a UUID or a random string)
        const sessionId = generateSessionId(); // Implement your session ID generation function here

        // Save the session ID in the user's record
        const updateSessionSQL = 'UPDATE users SET session_id = ? WHERE id = ?';
        db.query(updateSessionSQL, [sessionId, user.id], (err, result) => {
            if (err) {
                return res.status(500).send('Database error while updating session.');
            }

            // Save the user's id, phone number, and wallet balance in the session
            req.session.user = { 
                id: user.id, 
                phone_number: user.phone_number, 
                wallet_balance: user.wallet_balance, 
                session_id: sessionId 
            };
            res.redirect('/');
        });
    });
});

function generateSessionId() {
    // Function to generate a unique session ID, this can be a random string or UUID
    return Math.random().toString(36).substr(2); // Simple example, improve for production
}

module.exports = router;
