const express = require('express');
const db = require('../config/db'); // Import the database connection
const router = express.Router();

// Admin panel to view all withdrawals
router.get('/withdrawals', (req, res) => {
    const getWithdrawalsQuery = 'SELECT * FROM transactions WHERE type = ?';
    db.query(getWithdrawalsQuery, ['withdrawal'], (err, results) => {
        if (err) {
            console.error('Error fetching withdrawals:', err);
            return res.send('Error fetching withdrawals. Please try again later.');
        }

        // Pass transactions with type field to view
        res.render('adminWithdrawals', { withdrawals: results });
    });
});

// Admin panel to view pending transactions
router.get('/', (req, res) => {
    const query = 'SELECT * FROM transactions WHERE status = "pending"';
    db.query(query, (err, transactions) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.send('Error fetching transactions. Please try again later.');
        }

        // Ensure transactions include 'type'
        res.render('admin', { transactions });
    });
});

// Admin route to approve a transaction
router.post('/approve/:id', (req, res) => {
    const transactionId = req.params.id;

    // Get the transaction details (amount, phone number, and type)
    const getTransactionQuery = 'SELECT * FROM transactions WHERE id = ?';
    db.query(getTransactionQuery, [transactionId], (err, result) => {
        if (err) {
            console.error('Error fetching transaction:', err);
            return res.send('Error fetching transaction. Please try again later.');
        }

        const transaction = result[0];
        const amount = transaction.amount;
        const phone = transaction.user_phone;

        if (transaction.type === 'deposit') {
            // For deposit, update the user's wallet balance
            const updateBalanceQuery = 'UPDATE users SET wallet_balance = wallet_balance + ?, deposit_balance = deposit_balance + ? WHERE phone_number = ?';
            db.query(updateBalanceQuery, [amount, amount, phone], (err) => {
                if (err) {
                    console.error('Error updating wallet balance:', err);
                    return res.send('Error updating wallet balance. Please try again later.');
                }

                // Mark transaction as "completed"
                const updateTransactionQuery = 'UPDATE transactions SET status = "completed" WHERE id = ?';
                db.query(updateTransactionQuery, [transactionId], (err) => {
                    if (err) {
                        console.error('Error updating transaction status:', err);
                        return res.send('Error updating transaction status. Please try again later.');
                    }
                    res.redirect('/admin');
                });
            });
        } else if (transaction.type === 'withdrawal') {
            // For withdrawal, just mark it as completed
            const updateTransactionQuery = 'UPDATE transactions SET status = "completed" WHERE id = ?';
            db.query(updateTransactionQuery, [transactionId], (err) => {
                if (err) {
                    console.error('Error updating transaction status:', err);
                    return res.send('Error updating transaction status. Please try again later.');
                }
                res.redirect('/admin');
            });
        }
    });
});

// Admin route to reject a transaction
router.post('/reject/:id', (req, res) => {
    const transactionId = req.params.id;

    // Get the transaction details (amount, phone number, and type)
    const getTransactionQuery = 'SELECT * FROM transactions WHERE id = ?';
    db.query(getTransactionQuery, [transactionId], (err, result) => {
        if (err) {
            console.error('Error fetching transaction:', err);
            return res.send('Error fetching transaction. Please try again later.');
        }

        const transaction = result[0];
        const amount = transaction.amount;
        const phone = transaction.user_phone;

        // Update the transaction status to 'rejected'
        const updateTransactionQuery = 'UPDATE transactions SET status = "rejected" WHERE id = ?';
        db.query(updateTransactionQuery, [transactionId], (err) => {
            if (err) {
                console.error('Error updating transaction status:', err);
                return res.send('Error updating transaction status. Please try again later.');
            }

            if (transaction.type === 'withdrawal') {
                // For withdrawal, refund the amount back to the user's wallet
                const refundBalanceQuery = 'UPDATE users SET wallet_balance = wallet_balance + ? WHERE phone_number = ?';
                db.query(refundBalanceQuery, [amount, phone], (err) => {
                    if (err) {
                        console.error('Error refunding amount to wallet:', err);
                        return res.send('Error refunding amount to wallet. Please try again later.');
                    }

                    // Redirect back to the admin panel
                    res.redirect('/admin');
                });
            } else {
                // For deposit, do nothing (no change in the user's wallet)
                res.redirect('/admin');
            }
        });
    });
});

module.exports = router;
