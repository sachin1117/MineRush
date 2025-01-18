const express = require('express');
const db = require('../config/db'); // Import the database connection

const router = express.Router();

// POST route for withdrawal request
router.post('/', (req, res) => {
    const { amount, upi } = req.body;
    const phone_number = req.session.user?.phone_number; // Use 'phone_number' from session

    // Check if the user is logged in
    if (!phone_number) {
        return res.status(401).redirect('/login'); // Ensure user is logged in
    }

    // Check if the user is registered based on the phone number
    const checkUserQuery = 'SELECT * FROM users WHERE phone_number = ?';
    db.query(checkUserQuery, [phone_number], (err, result) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.send('Error checking user. Please try again later.');
        }

        // If user is not found, return a message
        if (result.length === 0) {
            return res.send('Phone number not registered. Please register first.');
        }

        // Get the user's current wallet balance and deposit balance
        const user = result[0];
        const wallet_balance = user.wallet_balance;
        const deposit_balance = user.deposit_balance;

        // Calculate the win balance (wallet_balance - deposit_balance)
        const win_balance = wallet_balance - deposit_balance;

        // Check if the user has enough win balance for the withdrawal
        if (win_balance < amount) {
            return res.send('Insufficient win balance for this withdrawal.');
        }

        // Deduct the withdrawal amount from the win balance
        const updateBalanceQuery = 'UPDATE users SET wallet_balance = wallet_balance - ? WHERE phone_number = ?';
        db.query(updateBalanceQuery, [amount, phone_number], (err) => {
            if (err) {
                console.error('Error updating wallet balance:', err);
                return res.send('Error processing withdrawal request. Please try again later.');
            }

            // Insert the withdrawal request into the database with status 'pending'
            const insertQuery = 'INSERT INTO transactions (user_phone, amount, type, status, upi) VALUES (?, ?, ?, ?, ?)';
            db.query(insertQuery, [phone_number, amount, 'withdrawal', 'pending', upi], (err, insertResult) => {
                if (err) {
                    console.error('Error inserting withdrawal request:', err);
                    return res.send('Error processing withdrawal request. Please try again later.');
                }

                // Render the withdrawal page with transaction details and status 'pending'
                res.render('withdraw', {
                    phone_number,
                    wallet_balance: wallet_balance - amount, // Updated wallet balance after withdrawal
                    win_balance, // Pass win_balance to the template
                    withdrawRequest: true,
                    amount,
                    transactionId: insertResult.insertId, // Pass the transaction ID for reference
                    upi, // Pass UPI ID to the view
                    status: 'pending' // Status of the request is pending
                });
            });
        });
    });
});

// GET route for withdrawal page
router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }

    const phone_number = req.session.user.phone_number;

    // Fetch the user's wallet and deposit balance from the database
    const checkUserQuery = 'SELECT wallet_balance, deposit_balance FROM users WHERE phone_number = ?';
    db.query(checkUserQuery, [phone_number], (err, result) => {
        if (err) {
            console.error('Error fetching wallet balance:', err);
            return res.send('Error fetching wallet balance. Please try again later.');
        }

        if (result.length === 0) {
            return res.send('User not found. Please register first.');
        }

        const wallet_balance = result[0].wallet_balance;
        const deposit_balance = result[0].deposit_balance;

        // Calculate the win balance (wallet_balance - deposit_balance)
        const win_balance = wallet_balance - deposit_balance;

        // Get the 'amount' from query params if it exists (e.g., after form submission)
        const amount = req.query.amount || 0;

        // Render the withdrawal page with the current wallet balance, win balance, and amount
        res.render('withdraw', {
            phone_number,
            wallet_balance,
            win_balance, // Pass win_balance to the template
            amount, // Pass amount to the template
            withdrawRequest: false
        });
    });
});

module.exports = router;
