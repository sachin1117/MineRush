const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust the path to your database file

// Cash Out
router.post('/', (req, res) => {
    const userId = req.session.user.id; // Get user ID from session
    const gameState = req.session.gameState;

    if (!gameState || !gameState.isGameStarted) {
        return res.status(400).json({ error: 'Game not started.' });
    }

    if (gameState.currentWinnings <= 0) {
        return res.status(400).json({ error: 'No winnings to cash out.' });
    }

    const totalPayout = gameState.betAmount + gameState.currentWinnings;

    // Fetch the current wallet balance
    db.query('SELECT wallet_balance FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        const currentBalance = results[0].wallet_balance;
        const newBalance = currentBalance + totalPayout;

        // Update wallet balance with the payout
        db.query('UPDATE users SET wallet_balance = ? WHERE id = ?', [newBalance, userId], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            // End the game
            gameState.isGameStarted = false;
            res.json({ walletBalance: newBalance, payout: totalPayout });
        });
    });
});

module.exports = router;
