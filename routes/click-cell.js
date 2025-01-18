const express = require('express');
const router = express.Router();

// Click Cell (Reveal)
router.post('/', (req, res) => {
    const { cellIndex } = req.body;
    const userId = req.session.user.id; // Get user ID from session
    const gameState = req.session.gameState;

    if (!gameState || !gameState.isGameStarted) {
        return res.status(400).json({ error: 'Game not started.' });
    }

    if (typeof cellIndex !== 'number' || cellIndex < 0 || cellIndex >= 25) {
        return res.status(400).json({ error: 'Invalid cell index.' });
    }

    // Check if the clicked cell is a mine
    if (gameState.minePositions.includes(cellIndex)) {
        // If the user hits a mine, reveal all mines and end the game
        gameState.currentWinnings = 0;
        gameState.isGameStarted = false;

        // Prepare the list of all mines to be revealed
        const revealedMines = gameState.minePositions.map(index => ({
            index,
            revealed: true
        }));

        // Respond with game over, message, and revealed mines
        return res.json({
            gameOver: true,
            message: 'You hit a mine! Game over!',
            revealedMines, // Send all revealed mines
            winnings: 0
        });
    }

    // If the user clicks on a safe cell, calculate winnings
    const rewardMultiplier = (gameState.minesCount / 20) * 0.5;
    const reward = gameState.betAmount * rewardMultiplier;
    gameState.currentWinnings += reward;

    // Respond with the current winnings and a safe status
    res.json({
        safe: true,
        winnings: gameState.currentWinnings+gameState.betAmount
    });
});

module.exports = router;
