require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const chalk = require('chalk');

// Routes imports
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const withdrawRoute = require('./routes/withdraw');
const depositRoute = require('./routes/deposit');
const adminRoute = require('./routes/admin');
const startGameRoute = require('./routes/startgame');
const clickCellRoute = require('./routes/click-cell');
const cashOutRoute = require('./routes/cash-out');
const refreshWalletRoute = require('./routes/refresh-wallet');
const submitUtrRoute = require('./routes/submit-utr');
const checkLoginStatusRoute = require('./routes/check-login-status');
const logoutRoute = require('./routes/logout');
const forgetPasswordRouter = require('./routes/forgetPassword');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/public', express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Middleware to check if user is authenticated
function authenticateUser(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(401).json({ error: 'User not authenticated' });
    }
}

// Routes setup
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/deposit', depositRoute);
app.use('/withdraw', withdrawRoute);
app.use('/admin', adminRoute);
app.use('/start-game', startGameRoute);
app.use('/click-cell', clickCellRoute);
app.use('/cash-out', cashOutRoute);
app.use('/refresh-wallet', refreshWalletRoute);
app.use('/submit-utr', submitUtrRoute);
app.use('/check-login-status', checkLoginStatusRoute);
app.use('/logout', logoutRoute);
app.use('/forgetpassword', forgetPasswordRouter);

// Serve Signup and Login Pages
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/forgot-password', (req, res) => {
    res.sendFile(__dirname + '/public/forgotpassword.html');
});
// Fallback for client-side routes to serve the reset-password page
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/reset-password.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(chalk.green(`Server running on http://localhost:${PORT}`));
});

