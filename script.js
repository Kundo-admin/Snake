const gameBoard = document.getElementById('gameBoard');
const scoreElement = document.getElementById('score');

const boardWidth = gameBoard.offsetWidth;
const boardHeight = gameBoard.offsetHeight;
const tileSize = 20; // Tamaño de cada casilla
const tilesPerRow = Math.floor(boardWidth / tileSize);
const tilesPerColumn = Math.floor(boardHeight / tileSize);

let snake = [{ x: Math.floor(tilesPerRow / 2), y: Math.floor(tilesPerColumn / 2) }];
let direction = null; // Dirección inicial (sin movimiento)
let food = { x: Math.floor(Math.random() * tilesPerRow), y: Math.floor(Math.random() * tilesPerColumn) };
let score = 0;
let gameOver = false;
let gamePaused = false;

/**
 * Crea un nuevo elemento de comida en el tablero.
 */
function createFood() {
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x * tileSize}px`;
    foodElement.style.top = `${food.y * tileSize}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

/**
 * Dibuja la serpiente y la comida en el tablero.
 */
function drawSnake() {
    gameBoard.innerHTML = ''; // Limpia el tablero
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${segment.x * tileSize}px`;
        snakeElement.style.top = `${segment.y * tileSize}px`;
        snakeElement.classList.add('snake');
        gameBoard.appendChild(snakeElement);
    });
    createFood(); // Dibuja la comida
}

/**
 * Actualiza la posición de la serpiente y verifica colisiones.
 */
function updateSnake() {
    if (direction) {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Verifica si la serpiente se sale del tablero y la mueve al borde opuesto
        if (head.x < 0) head.x = tilesPerRow - 1;
        if (head.x >= tilesPerRow) head.x = 0;
        if (head.y < 0) head.y = tilesPerColumn - 1;
        if (head.y >= tilesPerColumn) head.y = 0;

        // Verifica si la serpiente choca consigo misma
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOverSound.play(); // Reproduce el sonido de fin de juego
            gameOver = true; // Marca el juego como terminado
            alert('Game Over! Tu puntuación es: ' + score);
            return;
        }

        // Añade la nueva posición de la cabeza de la serpiente
        snake.unshift(head);

        // Verifica si la serpiente ha comido la comida
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = score;
            eatSound.play(); // Reproduce el sonido cuando la serpiente come la comida
            food = { x: Math.floor(Math.random() * tilesPerRow), y: Math.floor(Math.random() * tilesPerColumn) }; // Genera nueva comida
        } else {
            snake.pop(); // Elimina el último segmento de la serpiente si no ha comido
        }

        // Calcula la distancia entre la cabeza de la serpiente y la comida
        const distance = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
        const maxDistance = tilesPerRow + tilesPerColumn; // Distancia máxima
        const volume = Math.max(0, 1 - (distance / maxDistance)); // Ajusta el volumen basado en la distancia
        proximitySound.volume = volume; // Ajusta el volumen del sonido de proximidad
        proximitySound.play(); // Reproduce el sonido de proximidad
    }
}

/**
 * Reinicia el juego a su estado inicial.
 */
function resetGame() {
    snake = [{ x: Math.floor(tilesPerRow / 2), y: Math.floor(tilesPerColumn / 2) }];
    direction = null; // Restablece la dirección a nula
    food = { x: Math.floor(Math.random() * tilesPerRow), y: Math.floor(Math.random() * tilesPerColumn) };
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    gamePaused = false;
    drawSnake(); // Dibuja el estado inicial del tablero
}

/**
 * Actualiza el juego en cada intervalo de tiempo.
 */
function gameLoop() {
    if (!gameOver && !gamePaused) {
        updateSnake(); // Actualiza la serpiente
        drawSnake(); // Redibuja la serpiente y la comida
    }
}

/**
 * Cambia la dirección de la serpiente basado en la tecla presionada.
 * @param {KeyboardEvent} event - El evento de teclado.
 */
function changeDirection(event) {
    switch (event.key) {
        case 'w':
        case 'W':
            if (direction === null || direction.y === 0) direction = { x: 0, y: -1 }; // Mueve hacia arriba
            break;
        case 's':
        case 'S':
            if (direction === null || direction.y === 0) direction = { x: 0, y: 1 }; // Mueve hacia abajo
            break;
        case 'a':
        case 'A':
            if (direction === null || direction.x === 0) direction = { x: -1, y: 0 }; // Mueve hacia la izquierda
            break;
        case 'd':
        case 'D':
            if (direction === null || direction.x === 0) direction = { x: 1, y: 0 }; // Mueve hacia la derecha
            break;
        case ' ':
            gamePaused = !gamePaused; // Alterna entre pausa y reanudación del juego
            break;
        case 'r':
        case 'R':
            resetGame(); // Reinicia el juego
            break;
    }
}

document.addEventListener('keydown', changeDirection); // Escucha eventos de teclado
setInterval(gameLoop, 100); // Ejecuta el ciclo del juego cada 100 ms
