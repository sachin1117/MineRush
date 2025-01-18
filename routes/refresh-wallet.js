const express = require('express');
const db = require('../config/db'); // Database connection
const router = express.Router();

// Middleware to check if user is authenticated
function authenticateUser(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(401).json({ error: 'User not authenticated' });
    }
}

// Refresh wallet balance route
router.get('/', authenticateUser, (req, res) => {
    const userId = req.session.user?.id; // Get user ID from session

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    db.query('SELECT wallet_balance FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching wallet balance from database:', err);
            return res.status(500).json({ error: 'Database error while fetching wallet balance.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const balance = results[0].wallet_balance;
        res.json({ balance });
    });
});

module.exports = router;
