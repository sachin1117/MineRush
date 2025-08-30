🎮 MineRush - Mines Game with Admin Panel

MineRush is a simple yet fun Mines Game built with Node.js, MySQL, HTML, CSS, and JavaScript.
It supports deposits, withdrawals, and includes an Admin Panel for managing users and transactions.

✨ Features

🎲 Play Mines Game with dynamic logic

💰 Deposit & Withdraw functionality

🔑 User authentication & session handling

🛠 Admin Panel to manage players and transactions

🗄 MySQL database (via XAMPP)

📱 Responsive frontend (HTML, CSS, JS)

🛠 Tech Stack

Backend: Node.js, Express.js

Database: MySQL (XAMPP server)

Frontend: HTML5, CSS3, JavaScript

Authentication: Express-session

Email Service: Gmail SMTP (for password reset)

⚙️ Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/sachin1117/MineRush.git
cd MineRush


2️⃣ Install dependencies

npm install


3️⃣ Setup MySQL using XAMPP and create a new database (example: minerush_db).

4️⃣ Add a .env file in the project root.

🌍 Example .env File
# Database Credentials
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=minerush_db
DB_PORT=3306
PORT=5000

# Session Secret
SESSION_SECRET=your_secret_key_here

# UPI Config
UPI_ID=
UPI_NAME=sachin

# Gmail Config (for Forgot Password)
GMAIL_USER=
GMAIL_PASS=
CLIENT_URL=http://localhost:3000

▶️ Running the Project
npm run dev


The server will run at: http://localhost:5000

📂 Folder Structure
MineRush/
├── config/        # Database connection
├── public/        # Static files (HTML, CSS, JS)
├── routes/        # API routes
├── views/         # Templates (if any)
├── server.js      # Main entry point
├── package.json   # Dependencies
└── .env           # Environment variables

🤝 Contributing

Fork the repository

Create a new branch (feature/my-feature)

Commit your changes

Push & open a Pull Request

📧 Contact

Author: Sachin
🔗 GitHub: sachin1117
