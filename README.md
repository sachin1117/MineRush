# 🎮 MineRush  
> A Mines game with **deposit, withdrawal, and admin management**, built using **Node.js, MySQL, HTML, CSS, and JavaScript**.  

![Game Preview](https://img.shields.io/badge/Status-Active-success?style=flat-square)  
![Tech](https://img.shields.io/badge/Stack-Node.js%20%7C%20MySQL%20%7C%20HTML%20%7C%20CSS%20%7C%20JS-blue?style=flat-square)  
![Contributions](https://img.shields.io/badge/Contributions-Welcome-orange?style=flat-square)  

---

## ✨ Features  
- 🎲 **Play Mines Game** with dynamic gameplay  
- 💰 **Deposit & Withdraw** system  
- 🔑 **Authentication** with sessions  
- 🛠 **Admin Panel** to manage users & transactions  
- 📩 **Password reset via Gmail SMTP**  
- 📱 **Responsive UI** (HTML + CSS + JS)  

---

## 🛠 Tech Stack  
- **Backend:** Node.js (Express.js)  
- **Database:** MySQL (XAMPP server)  
- **Frontend:** HTML5, CSS3, JavaScript  
- **Auth & Security:** Express-session, dotenv  
- **Email Service:** Gmail SMTP  

---

## ⚙️ Installation & Setup  

1️⃣ **Clone the repository**  
```bash
git clone https://github.com/sachin1117/MineRush.git
cd MineRush
2️⃣ Install dependencies

bash
Copy code
npm install
3️⃣ Setup MySQL with XAMPP

Start Apache & MySQL from XAMPP Control Panel

Create a database (e.g. minerush_db)

Import SQL schema (if provided)

4️⃣ Add .env file in the project root

🌍 Example .env File
env
Copy code
# Database
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

# Gmail Config (For password reset)
GMAIL_USER=
GMAIL_PASS=
CLIENT_URL=http://localhost:3000
▶️ Running the Project
bash
Copy code
npm run dev
Your server will start on: http://localhost:5000

📂 Folder Structure
bash
Copy code
MineRush/
├── config/         # Database connection
├── public/         # Frontend assets (HTML, CSS, JS)
├── routes/         # Application routes
├── views/          # Templates (if using EJS/HTML)
├── server.js       # Main entry
├── package.json    # Dependencies
└── .env            # Environment variables
🤝 Contributing
Want to improve MineRush?

Fork the repo

Create a feature branch (git checkout -b feature-name)

Commit changes (git commit -m "Added new feature")

Push (git push origin feature-name)

Open a Pull Request 🚀

📧 Contact
👨‍💻 Author: Sachin
🔗 GitHub: @sachin1117

🚀 Next Steps
 Dockerize for easier deployment

 Deploy to Render / Railway / Vercel

 Add transaction history & filtering

 Enhance UI for Admin Dashboard

pgsql
Copy code

---

Would you like me to also **write a ready-to-import SQL schema** (`users`, `transactions`, `admin`) so anyone can set up the database instantly in XAMPP?
