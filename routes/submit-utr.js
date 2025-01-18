const express = require('express');
const db = require('../config/db'); // Database connection
const router = express.Router();

// UTR Submission handler
router.post('/', (req, res) => {
    const { utr, transactionId } = req.body;
    const updateUTRQuery = 'UPDATE transactions SET utr = ?, status = "pending" WHERE id = ?';

    db.query(updateUTRQuery, [utr, transactionId], (err) => {
        if (err) {
            console.error('Error processing UTR:', err);
            res.status(500).send('Error processing UTR');
            return;
        }

        const referer = req.get('Referer') || '/'; // Default to home if no referer
        res.redirect(referer);
    });
});

module.exports = router;
