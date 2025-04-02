// Game Constants
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const OBSTACLE_SPEED = 3;
const OBSTACLE_GAP = 150;
const OBSTACLE_FREQUENCY = 1200;
const SOLDIER_WIDTH = 60;
const SOLDIER_HEIGHT = 80;
const BACKGROUND_SCROLL_SPEED = 0.2;

// Game State
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('codVerticalOpsHighScore') || 0;
let lastObstacleTime = 0;
let backgroundX = 0;
let difficultyLevel = 1;
let currentRank = 'Private';

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const retryButton = document.getElementById('retryButton');

// Game Objects
const soldier = {
    x: 50,
    y: canvas.height / 2,
    width: SOLDIER_WIDTH,
    height: SOLDIER_HEIGHT,
    velocity: 0
};

const obstacles = [];

// Military-themed colors
const COLORS = {
  SOLDIER: '#8B4513', // Military brown
  SOLDIER_HEAD: '#5C4033',
  SOLDIER_VEST: '#654321',
  OBSTACLE: '#556B2F', // Camo green
  OBSTACLE_DETAIL: '#6B8E23',
  BACKGROUND: '#36454F', // Charcoal gray
  SKY: '#4682B4', // Steel blue
  TEXT: '#00FF00', // Military green
  EXPLOSION: '#FF4500' // Orange-red
};

// Draw functions
function drawSoldier() {
    // Body
    ctx.fillStyle = COLORS.SOLDIER;
    ctx.fillRect(soldier.x, soldier.y + 20, soldier.width, soldier.height - 20);
    
    // Vest
    ctx.fillStyle = COLORS.SOLDIER_VEST;
    ctx.fillRect(soldier.x + 10, soldier.y + 30, soldier.width - 20, soldier.height - 40);
    
    // Head
    ctx.fillStyle = COLORS.SOLDIER_HEAD;
    ctx.beginPath();
    ctx.arc(soldier.x + soldier.width/2, soldier.y + 15, 15, 0, Math.PI*2);
    ctx.fill();
    
    // Gun
    ctx.fillStyle = '#333';
    ctx.fillRect(soldier.x + soldier.width - 10, soldier.y + 30, 20, 5);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        // Main obstacle
        ctx.fillStyle = COLORS.OBSTACLE;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Camo pattern
        ctx.fillStyle = COLORS.OBSTACLE_DETAIL;
        for (let i = 0; i < 8; i++) {
            const x = obstacle.x + Math.random() * obstacle.width;
            const y = obstacle.y + Math.random() * obstacle.height;
            const size = Math.random() * 10 + 5;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI*2);
            ctx.fill();
        }
    });
}

// Initialize Game
function init() {
    highScoreDisplay.textContent = highScore;
    document.addEventListener('keydown', handleKeyDown);
    startButton.addEventListener('click', startGame);
    retryButton.addEventListener('click', () => {
        startGame();
        gameOverScreen.classList.add('hidden');
    });
    requestAnimationFrame(gameLoop);
}

// Game Loop
function gameLoop(timestamp) {
    // Draw background with parallax effect
    backgroundX -= BACKGROUND_SCROLL_SPEED;
    if (backgroundX < -canvas.width) backgroundX = 0;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, COLORS.SKY);
    skyGradient.addColorStop(1, COLORS.BACKGROUND);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    if (gameRunning) {
        updateSoldier();
        updateObstacles(timestamp);
        checkCollisions();
        drawUI();
    }

    drawSoldier();
    drawObstacles();
    requestAnimationFrame(gameLoop);
}

// Game Functions
function updateSoldier() {
    soldier.velocity += GRAVITY;
    soldier.y += soldier.velocity;
    
    // Boundary check
    if (soldier.y < 0) {
        soldier.y = 0;
        soldier.velocity = 0;
    }
    if (soldier.y > canvas.height - soldier.height) {
        soldier.y = canvas.height - soldier.height;
        gameOver();
    }
}

function updateObstacles(timestamp) {
    // Add new obstacles
    if (timestamp - lastObstacleTime > OBSTACLE_FREQUENCY) {
        addObstacle();
        lastObstacleTime = timestamp;
    }

    // Move obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= OBSTACLE_SPEED;
        
        // Remove off-screen obstacles
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}

function addObstacle() {
    const gapPosition = Math.random() * (canvas.height - OBSTACLE_GAP - 200) + 100;
    
    obstacles.push({
        x: canvas.width,
        y: 0,
        width: 80,
        height: gapPosition,
        passed: false
    });
    
    obstacles.push({
        x: canvas.width,
        y: gapPosition + OBSTACLE_GAP,
        width: 80,
        height: canvas.height - gapPosition - OBSTACLE_GAP,
        passed: false
    });
}

function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (
            soldier.x < obstacle.x + obstacle.width &&
            soldier.x + soldier.width > obstacle.x &&
            soldier.y < obstacle.y + obstacle.height &&
            soldier.y + soldier.height > obstacle.y
        ) {
            explosionEffect(soldier.x, soldier.y);
            gameOver();
        }
        
        // Score increment
        if (!obstacle.passed && obstacle.x + obstacle.width < soldier.x) {
            obstacle.passed = true;
            score++;
            updateRank();
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('codVerticalOpsHighScore', highScore);
                highScoreDisplay.textContent = highScore;
            }
        }
    });
}

function drawSoldier() {
    // Body
    ctx.fillStyle = COLORS.SOLDIER;
    ctx.fillRect(soldier.x, soldier.y + 20, soldier.width, soldier.height - 20);
    
    // Vest
    ctx.fillStyle = COLORS.SOLDIER_VEST;
    ctx.fillRect(soldier.x + 10, soldier.y + 30, soldier.width - 20, soldier.height - 40);
    
    // Head
    ctx.fillStyle = COLORS.SOLDIER_HEAD;
    ctx.beginPath();
    ctx.arc(soldier.x + soldier.width/2, soldier.y + 15, 15, 0, Math.PI*2);
    ctx.fill();
    
    // Gun
    ctx.fillStyle = '#333';
    ctx.fillRect(soldier.x + soldier.width - 10, soldier.y + 30, 20, 5);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        // Main obstacle
        ctx.fillStyle = COLORS.OBSTACLE;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Camo pattern
        ctx.fillStyle = COLORS.OBSTACLE_DETAIL;
        for (let i = 0; i < 8; i++) {
            const x = obstacle.x + Math.random() * obstacle.width;
            const y = obstacle.y + Math.random() * obstacle.height;
            const size = Math.random() * 10 + 5;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI*2);
            ctx.fill();
        }
    });
}

function drawUI() {
    ctx.fillStyle = '#00ff00';
    ctx.font = '24px Roboto Condensed';
    ctx.fillText(`SCORE: ${score}`, 20, 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Roboto Condensed';
    ctx.fillText(`RANK: ${currentRank}`, 20, 70);
}

function explosionEffect(x, y) {
    // Explosion core
    const gradient = ctx.createRadialGradient(
        x + soldier.width/2, y + soldier.height/2, 0,
        x + soldier.width/2, y + soldier.height/2, 40
    );
    gradient.addColorStop(0, COLORS.EXPLOSION);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + soldier.width/2, y + soldier.height/2, 40, 0, Math.PI*2);
    ctx.fill();
    
    // Shockwave
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + soldier.width/2, y + soldier.height/2, 45, 0, Math.PI*2);
    ctx.stroke();
}

function updateRank() {
    if (score >= 30) currentRank = 'General';
    else if (score >= 20) currentRank = 'Colonel';
    else if (score >= 15) currentRank = 'Major';
    else if (score >= 10) currentRank = 'Captain';
    else if (score >= 5) currentRank = 'Sergeant';
    else currentRank = 'Private';
}

function startGame() {
    gameRunning = true;
    score = 0;
    currentRank = 'Private';
    obstacles.length = 0;
    soldier.y = canvas.height / 2;
    soldier.velocity = 0;
    startScreen.style.opacity = '0';
    setTimeout(() => {
        startScreen.style.display = 'none';
    }, 300);
}

function gameOver() {
    gameRunning = false;
    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = 'flex';
    setTimeout(() => {
        gameOverScreen.style.opacity = '1';
    }, 10);
}

// Event Handlers
function handleKeyDown(e) {
    if (e.code === 'Space') {
        if (!gameRunning) {
            startGame();
        } else {
            soldier.velocity = JUMP_FORCE;
        }
    }
}

// Start the game
init();
