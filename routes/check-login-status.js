const express = require('express');
const router = express.Router();

// Check login status handler
router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        const userPhoneNumber = req.session.user.phone;
        res.json({ loggedIn: true, phoneNumber: userPhoneNumber });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;
