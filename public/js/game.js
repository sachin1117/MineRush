document.addEventListener("DOMContentLoaded", () => {
    // Cache DOM elements
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const depositBtn = document.getElementById("deposit-btn");
    const withdrawBtn = document.getElementById("withdraw-btn");
    const startGameBtn = document.getElementById("start-game-btn");
    const cashOutBtn = document.getElementById("cash-out-btn");
    const walletBalanceElement = document.getElementById("wallet-balance");
    const betAmountInput = document.getElementById("bet-amount");
    const minesCountInput = document.getElementById("mines-count");
    const gameGrid = document.getElementById("gameGrid");
    const errorMessage = document.getElementById("error-message");
  
    let isGameStarted = false;
    let gameState = null;  // Store game state (bet amount, mines, winnings)
  
    // Function to check login status
    async function checkLoginStatus() {
        try {
            const response = await fetch("/check-login-status");
            const data = await response.json();
  
            if (data.loggedIn) {
                loginBtn.style.display = "none";
                signupBtn.style.display = "none";
                depositBtn.style.display = "inline-block";
                withdrawBtn.style.display = "inline-block";
                await fetchWalletBalance();
            } else {
                loginBtn.style.display = "inline-block";
                signupBtn.style.display = "inline-block";
                depositBtn.style.display = "none";
                withdrawBtn.style.display = "none";
            }
        } catch (error) {
            console.error("Error checking login status:", error);
        }
    }
  
    // Function to fetch wallet balance
    async function fetchWalletBalance() {
        try {
            const response = await fetch("/refresh-wallet");
            const data = await response.json();
            if (data.balance !== undefined) {
                walletBalanceElement.textContent = `${data.balance.toFixed(2)}`;
            }
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
        }
    }
  
    // Function to start a new game
    async function startGame() {
        if (isGameStarted) return;
  
        const betAmount = parseFloat(betAmountInput.value);
        const minesCount = parseInt(minesCountInput.value);
  
        if (betAmount <= 0 || isNaN(betAmount) || minesCount < 1 || minesCount > 20 || isNaN(minesCount)) {
            errorMessage.textContent = "Invalid bet amount or mines count!";
            return;
        }
  
        try {
            const response = await fetch("/start-game", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ betAmount, minesCount }),
            });
  
            const data = await response.json();
            if (response.ok) {
                gameState = data; // Store game state
                walletBalanceElement.textContent = `${data.walletBalance.toFixed(2)}`;
                generateGrid();
                isGameStarted = true;
                cashOutBtn.disabled = false;
                errorMessage.textContent = "";
            } else {
                errorMessage.textContent = data.error || "Failed to start the game.";
            }
        } catch (error) {
            errorMessage.textContent = "Failed to start the game.";
            console.error(error);
        }
    }
  
    // Function to generate game grid
    function generateGrid() {
      const gameGrid = document.getElementById('gameGrid'); // Ensure the grid element is selected
      gameGrid.innerHTML = ""; // Clear existing grid
  
      for (let i = 0; i < 25; i++) {
          const cell = document.createElement("div");
          cell.className = "game-cell neu-brutal aspect-square flex items-center justify-center text-xl font-bold cursor-pointer transition-transform duration-300 hover:scale-105";
          cell.addEventListener("click", () => handleCellClick(cell, i));
          gameGrid.appendChild(cell);
      }
    }
  
    // Function to handle cell click
    async function handleCellClick(cell, cellIndex) {
      if (!isGameStarted || cell.classList.contains("revealed")) return;
  
      try {
          const response = await fetch("/click-cell", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cellIndex }),
          });
  
          const data = await response.json();
          if (data.gameOver) {
              // If the game is over, reveal all mines
              revealAllMines(data.revealedMines);
              errorMessage.textContent = data.message;
              endGame();
          } else if (data.safe) {
              // Handle safe cell click
              cell.textContent = "💎";
              cell.classList.add("revealed", "bg-[#6EE7B7]"); // Safe cell styling
              gameState.currentWinnings = data.winnings;
              errorMessage.textContent = `Safe! Current Winnings: ₹${data.winnings.toFixed(2)}`;
          }
      } catch (error) {
          console.error("Error handling cell click:", error);
      }
    }
  
    // Function to reveal all mines (bombs) on the grid
    function revealAllMines(revealedMines) {
      revealedMines.forEach(mine => {
          const cell = document.getElementById('gameGrid').children[mine.index];
          if (cell) {
              cell.textContent = "💥"; // Show bomb emoji
              cell.classList.add("revealed", "bg-red-600"); // Add styles for revealed mines
          }
      });
    }
  
    // Function to cash out
    async function cashOut() {
        if (!isGameStarted) return;
  
        try {
            const response = await fetch("/cash-out", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
  
            const data = await response.json();
            if (response.ok) {
                walletBalanceElement.textContent = `${data.walletBalance.toFixed(2)}`;
                alert(`You cashed out 🎉 ₹${data.payout.toFixed(2)}!`);
                endGame();
            } else {
                errorMessage.textContent = data.error || "Failed to cash out.";
            }
        } catch (error) {
            console.error("Error cashing out:", error);
        }
    }
  
    // Function to end the game
    function endGame() {
        isGameStarted = false;
        cashOutBtn.disabled = true;
    }
  
    // Attach event listeners
    depositBtn.addEventListener("click", () => (window.location.href = "/deposit"));
    withdrawBtn.addEventListener("click", () => (window.location.href = "/withdraw"));
    startGameBtn.addEventListener("click", startGame);
    cashOutBtn.addEventListener("click", cashOut);
  
    // Check login status on page load
    checkLoginStatus();
  
    // Refresh wallet balance
    document.querySelector(".bi-arrow-clockwise").addEventListener("click", fetchWalletBalance);
  });
  