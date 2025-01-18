const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import database configuration
const chalk = require('chalk'); // Import the chalk library

// Middleware to check if the user is authenticated
function authenticateUser(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(401).json({ error: 'User not authenticated' });
    }
}

// Start Game
router.post('/', authenticateUser, (req, res) => {
    const userId = req.session.user?.id; // Get user ID from session

    if (!userId) {
        console.error('User ID not found in session');
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    console.log(chalk.blue('User ID from session:', userId)); // Log user ID for debugging

    const { betAmount, minesCount } = req.body;

    if (!Number.isInteger(betAmount) || betAmount <= 0) {
        console.error('Invalid bet amount:', betAmount);
        return res.status(400).json({ error: 'Invalid bet amount. It must be a positive number.' });
    }

    if (!Number.isInteger(minesCount) || minesCount < 1 || minesCount > 24) {
        console.error('Invalid number of mines:', minesCount);
        return res.status(400).json({ error: 'Number of mines must be between 1 and 24.' });
    }

    // Fetch both wallet_balance and deposit_balance from the database
    db.query('SELECT wallet_balance, deposit_balance FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching balances from database:', err);
            return res.status(500).json({ error: 'Database error while fetching balances.' });
        }

        if (results.length === 0) {
            console.error('User not found for ID:', userId);
            return res.status(404).json({ error: 'User not found.' });
        }

        const { wallet_balance, deposit_balance } = results[0];
        //console.log(chalk.green('Current wallet balance for user', userId, ':', wallet_balance));
        //console.log(chalk.green('Current deposit balance for user', userId, ':', deposit_balance));

        if (betAmount > wallet_balance) {
            console.error('Insufficient wallet balance for bet:', betAmount);
            return res.status(400).json({ error: 'Insufficient wallet balance for this bet.' });
        }

        // Deduct from wallet_balance
        const newWalletBalance = wallet_balance - betAmount;

        // Deduct from deposit_balance but ensure it doesn't go below 0
        const newDepositBalance = Math.max(0, deposit_balance - betAmount);

         // console.log(chalk.yellow('New wallet balance after bet:', newWalletBalance));
        //console.log(chalk.yellow('New deposit balance after bet:', newDepositBalance));

        // Update wallet_balance and deposit_balance in the database
        db.query('UPDATE users SET wallet_balance = ?, deposit_balance = ? WHERE id = ?', [newWalletBalance, newDepositBalance, userId], (err) => {
            if (err) {
                console.error('Error updating balances in database:', err);
                return res.status(500).json({ error: 'Database error while updating balances.' });
            }

            // Start the game
            const totalCells = 25;
            const minePositions = new Set();
            while (minePositions.size < minesCount) {
                minePositions.add(Math.floor(Math.random() * totalCells));
            }

            const gameState = {
                betAmount,
                minesCount,
                currentWinnings: 0,
                minePositions: Array.from(minePositions),
                isGameStarted: true,
            };

            req.session.gameState = gameState; // Store game state in session

            // Print the game start message with color and new lines
                console.log(chalk.magenta(`
  Game started with:
  Bet Amount: ${betAmount}
  Mines Count: ${minesCount}
                                      `));

            res.json({
                walletBalance: newWalletBalance,
                depositBalance: newDepositBalance
            });
        });
    });
});

module.exports = router;
