<?php
// game.php - Main game page
session_start();
$title = "Play - Santa's Adaptive Christmas Fifteen Puzzle";
include 'includes/header.php';
?>
<main>
    <div id="game-board"></div>
    <div id="game-ui">
        <span id="timer">00:00</span>
        <span id="move-counter">Moves: 0</span>
        <button id="reset-btn">Reset</button>
        <button id="newgame-btn">New Game</button>
        <button id="hint-btn">Hint</button>
        <button id="freeze-btn">Freeze Timer</button>
        <button id="shuffle-btn">Mini Shuffle</button>
    </div>
</main>
<script src="js/game.js"></script>
<?php include 'includes/footer.php'; ?>
