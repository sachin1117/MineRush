const express = require('express');
const db = require('../config/db'); // Import the database connection
const qrcode = require('qrcode');

const router = express.Router();

// POST route for handling deposits
router.post('/', (req, res) => {
    const { amount } = req.body;
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

        // Get the user's current wallet balance
        const user = result[0]; // Assuming only one result will be returned
        const currentBalance = user.wallet_balance;

        // Insert the deposit transaction into the database without updating balance
        const insertQuery = 'INSERT INTO transactions (user_phone, amount, type, status) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [phone_number, amount, 'deposit', 'pending'], (err, insertResult) => {
            if (err) {
                console.error('Error inserting deposit:', err);
                return res.send('Error processing deposit. Please try again later.');
            }

            // Generate UPI payment URL
            const upiPaymentUrl = `upi://pay?pa=${encodeURIComponent(process.env.UPI_ID)}&pn=GamingApp&am=${amount}&cu=INR`;

            // Generate the QR code URL for payment
            qrcode.toDataURL(upiPaymentUrl, (err, qrCodeUrl) => {
                if (err) {
                    console.error('Error generating QR code:', err);
                    return res.send('Error generating QR code. Please try again later.');
                }

                // Render the deposit page with QR code and transaction details
                res.render('deposit', {
                    phone_number,
                    wallet_balance: currentBalance, // Show the current wallet balance, not updated yet
                    qrCodeUrl,
                    amount,
                    transactionId: insertResult.insertId, // Pass the transaction ID for UTR submission
                });
            });
        });
    });
});

// GET route for deposit page
router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }

    const phone_number = req.session.user.phone_number;

    // Fetch the user's wallet balance from the database
    const checkUserQuery = 'SELECT wallet_balance FROM users WHERE phone_number = ?';
    db.query(checkUserQuery, [phone_number], (err, result) => {
        if (err) {
            console.error('Error fetching wallet balance:', err);
            return res.send('Error fetching wallet balance. Please try again later.');
        }

        if (result.length === 0) {
            return res.send('User not found. Please register first.');
        }

        const wallet_balance = result[0].wallet_balance;

        // Render the deposit page with the current wallet balance
        res.render('deposit', {
            phone_number,
            wallet_balance,
            qrCodeUrl: null,
            amount: null,
        });
    });
});

module.exports = router;
