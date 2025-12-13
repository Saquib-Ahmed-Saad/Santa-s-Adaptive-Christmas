// Santa's Adaptive Christmas Fifteen Puzzle - Core Puzzle Engine
// Step 2: Board logic, rendering, movement, win check

const BOARD_SIZE = 4;
let board = [];
let emptyTile = { row: 3, col: 3 };
let moveCount = 0;
let timer = 0;
let timerInterval = null;

// Initialize board with image tiles (0-14), 15 is empty, then shuffle to solvable state
function initBoard() {
    let tiles = [];
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE - 1; i++) {
        tiles.push(i);
    }
    tiles.push(null); // empty tile
    do {
        shuffleArray(tiles);
    } while (!isSolvable(tiles));
    board = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        let row = [];
        for (let c = 0; c < BOARD_SIZE; c++) {
            let idx = r * BOARD_SIZE + c;
            row.push(tiles[idx]);
            if (tiles[idx] === null) emptyTile = { row: r, col: c };
        }
        board.push(row);
    }
}

// Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Check if a board is solvable
function isSolvable(tiles) {
    let invCount = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[i] !== null && tiles[j] !== null && tiles[i] > tiles[j]) invCount++;
        }
    }
    // Find row of empty tile from bottom
    let emptyRow = Math.floor(tiles.indexOf(null) / BOARD_SIZE);
    let emptyRowFromBottom = BOARD_SIZE - emptyRow;
    if (BOARD_SIZE % 2 === 1) {
        return invCount % 2 === 0;
    } else {
        return (invCount + emptyRowFromBottom) % 2 === 0;
    }
}

// Render board as image tiles
function renderBoard() {
    const boardDiv = document.getElementById('game-board');
    boardDiv.innerHTML = '';
    boardDiv.className = 'board';
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const tile = board[r][c];
            const tileDiv = document.createElement('div');
            tileDiv.className = tile === null ? 'tile empty' : 'tile';
            tileDiv.style.left = `${c * 80}px`;
            tileDiv.style.top = `${r * 80}px`;
            if (tile !== null) {
                tileDiv.style.backgroundImage = `url('assets/tile${tile}.png')`;
                tileDiv.dataset.row = r;
                tileDiv.dataset.col = c;
                tileDiv.addEventListener('click', onTileClick);
            }
            boardDiv.appendChild(tileDiv);
        }
    }
}

// Check if move is valid (adjacent to empty)
function isValidMove(row, col) {
    const dr = Math.abs(row - emptyTile.row);
    const dc = Math.abs(col - emptyTile.col);
    return (dr + dc === 1);
}

// Swap tile with empty
function moveTile(row, col) {
    if (!isValidMove(row, col)) return;
    board[emptyTile.row][emptyTile.col] = board[row][col];
    board[row][col] = null;
    emptyTile = { row, col };
    moveCount++;
    updateMoveCounter();
    renderBoard();
    if (checkWin()) {
        onWin();
    }
}

function onTileClick(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    moveTile(row, col);
}

// Check for win
function checkWin() {
    let count = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (r === 3 && c === 3) return board[r][c] === null;
            if (board[r][c] !== count) return false;
            count++;
        }
    }
    return true;
}

function onWin() {
    clearInterval(timerInterval);
    // Unlock achievements based on performance
    if (timer < 90) unlockAchievement('Fast Solver');
    if (moveCount < 40) unlockAchievement('Holiday Hero');
    if (currentDifficulty === 'hard') unlockAchievement("Santa's Apprentice");
    alert('Congratulations! You solved the puzzle!');
    // Send result to backend
    fetch('api/game_session.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=end&moves=${moveCount}&time=${timer}&difficulty=${currentDifficulty}&completed=1`
    })
    .then(res => res.json())
    .then(data => {
        // Optionally handle response
    });
}

function unlockAchievement(name) {
    fetch('api/achievements.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `name=${encodeURIComponent(name)}`
    });
}

    let currentDifficulty = 'normal';
function updateMoveCounter() {
    document.getElementById('move-counter').textContent = `Moves: ${moveCount}`;
}

function startTimer() {
    timer = 0;
    document.getElementById('timer').textContent = '00:00';
    timerInterval = setInterval(() => {
        let shuffleCount = 100;
        if (currentDifficulty === 'easy') shuffleCount = 20;
        if (currentDifficulty === 'hard') shuffleCount = 300;
        timer++;
            for (let i = 0; i < shuffleCount; i++) shuffleArray(tiles);
        const sec = String(timer % 60).padStart(2, '0');
        document.getElementById('timer').textContent = `${min}:${sec}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Initialize game

function startGame() {
    stopTimer();
    initBoard();
    moveCount = 0;
    updateMoveCounter();
    renderBoard();
    startTimer();
    // Notify backend to start a new session
    fetch('api/game_session.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=start'
    })
    .then(res => res.json())
    .then(data => {
        // Optionally handle session_id or errors
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startGame();
    document.getElementById('reset-btn').addEventListener('click', startGame);
    document.getElementById('newgame-btn').addEventListener('click', startGame);
    document.getElementById('hint-btn').addEventListener('click', useHint);
    document.getElementById('freeze-btn').addEventListener('click', useFreeze);
    document.getElementById('shuffle-btn').addEventListener('click', useMiniShuffle);
});

function useHint() {
    // Highlight a tile that is not in the correct position but can move
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== null && board[r][c] !== r * BOARD_SIZE + c && isValidMove(r, c)) {
                // Highlight this tile
                const tiles = document.querySelectorAll('.tile');
                tiles.forEach(tile => {
                    if (parseInt(tile.dataset.row) === r && parseInt(tile.dataset.col) === c) {
                        tile.style.boxShadow = '0 0 16px 6px #ffd700';
                        setTimeout(() => { tile.style.boxShadow = ''; }, 1200);
                    }
                });
                return;
            }
        }
    }
}

function useFreeze() {
    // Pause timer for 5 seconds
    stopTimer();
    document.getElementById('freeze-btn').disabled = true;
    setTimeout(() => {
        startTimer();
        document.getElementById('freeze-btn').disabled = false;
    }, 5000);
}

function useMiniShuffle() {
    // Shuffle 3 random movable tiles
    let movable = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (isValidMove(r, c)) movable.push({ r, c });
        }
    }
    for (let i = 0; i < 3 && movable.length > 0; i++) {
        const idx = Math.floor(Math.random() * movable.length);
        const { r, c } = movable[idx];
        moveTile(r, c);
        movable.splice(idx, 1);
    }
}
