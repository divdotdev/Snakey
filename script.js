const eatSound = new Audio('eating.mp3');
const gameOverSound = new Audio('gameOver.mp3');
const bgMusic = new Audio('background.mp3');
bgMusic.loop = true;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBar = document.getElementById('scoreBar');
const startBtn = document.getElementById('startBtn');
const overlay = document.getElementById('overlay');
const popupScore = document.getElementById('popupScore');
const popupHighScore = document.getElementById('popupHighScore');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 20;
const tileCount = 20;
const gameSpeed = 150;

let snake, direction, food, score;
let highScore = 0;
let gameStarted = false;
let loopTimeout;

function initGame() {
    snake = [{ x: 10, y: 10 }];
    direction = 'RIGHT';
    score = 0;
    scoreBar.textContent = 'Score: 0';
    placeFood();
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function draw() {
    // Green game background
    ctx.fillStyle = '#1a6b1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Snake - bright green
    ctx.fillStyle = '#00FF00';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Food - red
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function move() {
    let head = { x: snake[0].x, y: snake[0].y };

    if (direction === 'UP')    head.y--;
    if (direction === 'DOWN')  head.y++;
    if (direction === 'LEFT')  head.x--;
    if (direction === 'RIGHT') head.x++;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreBar.textContent = 'Score: ' + score;
        eatSound.play();
        placeFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

function showGameOver() {
    gameOverSound.play();
    bgMusic.pause();
    bgMusic.currentTime = 0;

    if (score > highScore) highScore = score;
    popupScore.textContent = score;
    popupHighScore.textContent = highScore;
    overlay.classList.add('show');
}

function gameLoop() {
    move();

    if (checkCollision()) {
        showGameOver();
        draw();
        return;
    }

    draw();
    loopTimeout = setTimeout(gameLoop, gameSpeed);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp'    && direction !== 'DOWN')  direction = 'UP';
    if (e.key === 'ArrowDown'  && direction !== 'UP')    direction = 'DOWN';
    if (e.key === 'ArrowLeft'  && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT')  direction = 'RIGHT';
});

startBtn.addEventListener('click', function() {
    if (!gameStarted) {
        gameStarted = true;
        startBtn.style.display = 'none';
        initGame();
        gameLoop();
        bgMusic.play();
    }
});

restartBtn.addEventListener('click', function() {
    overlay.classList.remove('show');
    clearTimeout(loopTimeout);
    initGame();
    gameLoop();
    bgMusic.play();
});

// Initial draw so canvas isn't blank before start
initGame();
draw();
