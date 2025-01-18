const express = require('express');
const db = require('../config/db'); // Import the database connection
const router = express.Router();

// Logout route handler
router.get('/', (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(400).send('No user logged in.');
    }

    // Clear the session ID in the database
    const updateSQL = 'UPDATE users SET session_id = NULL WHERE id = ?';
    db.query(updateSQL, [userId], (err, result) => {
        if (err) {
            return res.status(500).send('Failed to clear session.');
        }

        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Logout failed.');
            }
            res.redirect('/login'); // Redirect to login page
        });
    });
});

module.exports = router;
