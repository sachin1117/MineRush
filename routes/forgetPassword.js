const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('../config/db'); // Database configuration
const router = express.Router();

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// Generate a random token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Send Reset Link
router.post('/send-reset-link', (req, res) => {
    const { gmail } = req.body;

    if (!gmail || !gmail.includes('@')) {
        return res.status(400).send('Invalid Gmail address');
    }

    const token = generateToken();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    db.query('SELECT * FROM users WHERE gmail = ?', [gmail], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(400).send('Gmail not found');
        }

        // Insert token and expiry time into the forgetpassword table
        db.query(
            'INSERT INTO forgetpassword (gmail, token, expiry) VALUES (?, ?, ?)',
            [gmail, token, expiry],
            async (err) => {
                if (err) {
                    console.error('Error saving token:', err);
                    return res.status(500).send('Error saving reset token');
                }

                // Create the reset link
                const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&gmail=${encodeURIComponent(gmail)}`;

                // Email options
                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: gmail,
                    subject: 'Password Reset Link',
                    html: `<p>Click the link below to reset your password. The link will expire in 10 minutes:</p>
                           <a href="${resetLink}">${resetLink}</a>`,
                };

                try {
                    // Send the reset link email
                    await transporter.sendMail(mailOptions);
                    res.json({ message: 'Reset link sent successfully' });
                } catch (error) {
                    console.error('Error sending email:', error);
                    res.status(500).send('Error sending reset link');
                }
            }
        );
    });
});

// Reset Password
router.post('/reset-password', (req, res) => {
    const { gmail, token, newPassword } = req.body;

    if (!gmail || !token || !newPassword) {
        return res.status(400).send('Gmail, token, and new password are required');
    }

    // Verify the token and expiry
    db.query(
        'SELECT * FROM forgetpassword WHERE gmail = ? AND token = ?',
        [gmail, token],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Database error');
            }

            if (results.length === 0) {
                return res.status(400).send('Invalid or expired reset link');
            }

            const record = results[0];

            // Check if the reset link has expired
            if (new Date() > new Date(record.expiry)) {
                return res.status(400).send('Reset link has expired');
            }

            // Hash the new password
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).send('Error hashing password');
                }

                // Update the user's password in the users table
                db.query(
                    'UPDATE users SET password = ? WHERE gmail = ?',
                    [hashedPassword, gmail],
                    (err) => {
                        if (err) {
                            console.error('Error updating password:', err);
                            return res.status(500).send('Error updating password');
                        }

                        // Delete the reset token after successful password update
                        db.query('DELETE FROM forgetpassword WHERE gmail = ?', [gmail], (err) => {
                            if (err) {
                                console.error('Error deleting reset record:', err);
                                return res.status(500).send('Error deleting reset record');
                            }

                            res.json({ message: 'Password reset successfully' });
                        });
                    }
                );
            });
        }
    );
});

module.exports = router;
