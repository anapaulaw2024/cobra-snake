const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Recuperar o high score do localStorage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Atualizar posição da comida
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// Lidar com Game Over
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Pressione Ok para recomeçar...");
    location.reload();
};

// Alterar direção do movimento
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Adicionar eventos aos botões de controle
controls.forEach(button =>
    button.addEventListener("click", () =>
        changeDirection({ key: button.dataset.key })
    )
);

// Inicializar o jogo
const initGame = () => {
    if (gameOver) return handleGameOver();

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Verificar se a cobra comeu a comida
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        // Adicionar segmento à cobra
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Atualizar posição da cobra
    snakeX += velocityX;
    snakeY += velocityY;

    // Mover o corpo da cobra
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    // Verificar colisões
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true;
        }
    }

    // Renderizar cobra e comida
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }

    playBoard.innerHTML = html;
};

// Configurar o jogo
updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
