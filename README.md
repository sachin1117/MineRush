Minerush-readme
🎮 MineRush - Mines Game with Admin Panel

MineRush is an interactive mines game built using Node.js, MySQL, HTML, CSS, and JavaScript. The project includes features for playing the game, handling deposits/withdrawals, and an Admin Panel for managing users and transactions.

✨ Features

🎲 Play Mines game with dynamic logic

💰 Deposit & Withdraw system

🔑 User authentication & session management

🛠️ Admin Panel to manage players and transactions

🗄️ MySQL database integration

📱 Responsive frontend (HTML, CSS, JS)

🛠 Tech Stack

Backend: Node.js, Express.js

Database: MySQL (using XAMPP server)

Frontend: HTML5, CSS3, JavaScript

Session Management: Express-session

Email Service: Gmail SMTP (for password reset)

⚙️ Installation & Setup

Clone the repository:

git clone https://github.com/sachin1117/MineRush.git
cd MineRush

Install dependencies:

npm install

Make sure you have XAMPP (or MySQL server) running. Create a database in MySQL before starting the app.

🌍 Environment Variables (.env)

Create a .env file in the project root:

# Database Credentials
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=minerush_db
DB_PORT=3306
PORT=5000


# Session Secret for Express
SESSION_SECRET=your_secret_key_here


# UPI ID and Name
UPI_ID=
UPI_NAME=sachin


# Forget Password Email Config
GMAIL_USER=
GMAIL_PASS=
CLIENT_URL=http://localhost:3000
▶️ Running the Project

Start the server:

npm run dev

Server will start at: http://localhost:5000

📂 Folder Structure
MineRush/
├── config/
│   └── db.js          # MySQL connection setup
├── public/            # Static assets (HTML, CSS, JS)
├── routes/            # API routes
├── views/             # Frontend templates (if any)
├── server.js          # Main server file
├── package.json       # Dependencies
└── .env               # Environment variables
🤝 Contributing

Contributions are welcome!

Fork the repository

Create a new branch (feature/new-feature)

Commit your changes

Push and open a Pull Request

📧 Contact / Author

Author: Sachin
🔗 GitHub: sachin1117

🚀 Next Steps

Add Docker support for easy deployment

Deploy to Render / Railway / Vercel

Improve Admin Dashboard UI

Add transaction history filters
