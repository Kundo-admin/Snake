// Obtén los elementos de audio del HTML
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

// Obtén el elemento de juego y puntuación
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

// Función para crear la comida
function createFood() {
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x * tileSize}px`;
    foodElement.style.top = `${food.y * tileSize}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);

    // Reproduce un sonido para la comida
    speak(`Food is at position ${food.x + 1}, ${food.y + 1}`);
}

// Función para dibujar la serpiente
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

// Función para actualizar la serpiente
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
        drawSnake();  // Redibuja la serpiente y la comida después de comer
    } else {
        snake.pop();
    }
}

// Función para reiniciar el juego
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

// Función principal del juego
function game
