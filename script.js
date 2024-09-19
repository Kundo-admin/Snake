// Obtén los elementos de audio del HTML
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

const gameBoard = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');

const boardSize = 400;
const tileSize = 20;
const tilesPerRow = boardSize / tileSize;

let snake = [{ x: 5, y: 5 }];
let direction = { x: 1, y: 0 };
let food = { x: Math.floor(Math.random() * tilesPerRow), y: Math.floor(Math.random() * tilesPerRow) };
let score = 0;
let gameOver = false;
let gamePaused = false;

function createFood() {
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x * tileSize}px`;
    foodElement.style.top = `${food.y * tileSize}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

function drawSnake() {
    gameBoard.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${segment.x * tileSize}px`;
        snakeElement.style.top = `${segment.y * tileSize}px`;
        snakeElement.classList.add('snake');
        gameBoard.appendChild(snakeElement);
    });
    createFood();
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0) head.x = tilesPerRow - 1;
    if (head.x >= tilesPerRow) head.x = 0;
    if (head.y < 0) head.y = tilesPerRow - 1;
    if (head.y >= tilesPerRow) head.y = 0;

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOverSound.play();  // Reproduce el sonido de game over
        speak(`Game Over. Your score is ${score}`);
        gameOver = true;
        alert('Game Over! Tu puntuación es: ' + score);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        eatSound.play();  // Reproduce el sonido cuando la serpiente come
        speak(`Score increased. Current score is ${score}`);
        food = { x: Math.floor(Math.random() * tilesPerRow), y: Math.floor(Math.random() * tilesPerRow) };
    } else {
        snake.pop();
    }
}

function resetGame() {
    snake = [{ x: 5, y: 5 }];
    direction = { x: 1, y: 0 };
    food = { x: Math.floor(Math.random() * tilesPerRow), y: Math.floor(Math.random() * tilesPerRow) };
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    gamePaused = false;
    drawSnake();
}

function gameLoop() {
    if (!gameOver && !gamePaused) {
        updateSnake();
        drawSnake();
    }
}

function changeDirection(event) {
    switch (event.key) {
        case 'w':
        case 'W':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 's':
        case 'S':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'a':
        case 'A':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'd':
        case 'D':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case ' ':
            gamePaused = !gamePaused;
            break;
        case 'r':
        case 'R':
            resetGame();
            break;
    }
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

document.addEventListener('keydown', changeDirection);
setInterval(gameLoop, 100);
