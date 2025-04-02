// Game Constants
const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const TREE_SPEED = 2;
const TREE_GAP = 120;
const TREE_FREQUENCY = 1500; // ms between trees
const MONKEY_WIDTH = 50;
const MONKEY_HEIGHT = 50;

// Game State
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('flappyMonkeyHighScore') || 0;
let lastTreeTime = 0;

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const highScoreDisplay = document.getElementById('highScoreDisplay');

// Game Objects
const monkey = {
    x: 50,
    y: canvas.height / 2,
    width: MONKEY_WIDTH,
    height: MONKEY_HEIGHT,
    velocity: 0
};

const trees = [];

// Image Assets
const monkeyImg = new Image();
monkeyImg.src = 'https://images.pexels.com/photos/1591776/pexels-photo-1591776.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2';

const treeTopImg = new Image();
treeTopImg.src = 'https://images.pexels.com/photos/326939/pexels-photo-326939.jpeg?auto=compress&cs=tinysrgb&w=100&h=200&dpr=2';

const treeBottomImg = new Image();
treeBottomImg.src = 'https://images.pexels.com/photos/326939/pexels-photo-326939.jpeg?auto=compress&cs=tinysrgb&w=100&h=200&dpr=2';

// Initialize Game
function init() {
    highScoreDisplay.textContent = highScore;
    document.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', handleClick);
    requestAnimationFrame(gameLoop);
}

// Game Loop
function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameRunning) {
        updateMonkey();
        updateTrees(timestamp);
        checkCollisions();
        drawScore();
    }

    drawMonkey();
    drawTrees();
    requestAnimationFrame(gameLoop);
}

// Game Functions
function updateMonkey() {
    monkey.velocity += GRAVITY;
    monkey.y += monkey.velocity;
    
    // Boundary check
    if (monkey.y < 0) monkey.y = 0;
    if (monkey.y > canvas.height - monkey.height) {
        monkey.y = canvas.height - monkey.height;
        gameOver();
    }
}

function updateTrees(timestamp) {
    // Add new trees
    if (timestamp - lastTreeTime > TREE_FREQUENCY) {
        addTree();
        lastTreeTime = timestamp;
    }

    // Move trees
    for (let i = trees.length - 1; i >= 0; i--) {
        trees[i].x -= TREE_SPEED;
        
        // Remove off-screen trees
        if (trees[i].x + trees[i].width < 0) {
            trees.splice(i, 1);
        }
    }
}

function addTree() {
    const gapPosition = Math.random() * (canvas.height - TREE_GAP - 100) + 50;
    
    trees.push({
        x: canvas.width,
        y: 0,
        width: 60,
        height: gapPosition,
        passed: false
    });
    
    trees.push({
        x: canvas.width,
        y: gapPosition + TREE_GAP,
        width: 60,
        height: canvas.height - gapPosition - TREE_GAP,
        passed: false
    });
}

function checkCollisions() {
    trees.forEach(tree => {
        if (
            monkey.x < tree.x + tree.width &&
            monkey.x + monkey.width > tree.x &&
            monkey.y < tree.y + tree.height &&
            monkey.y + monkey.height > tree.y
        ) {
            gameOver();
        }
        
        // Score increment
        if (!tree.passed && tree.x + tree.width < monkey.x) {
            tree.passed = true;
            score++;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('flappyMonkeyHighScore', highScore);
                highScoreDisplay.textContent = highScore;
            }
        }
    });
}

function drawMonkey() {
    if (monkeyImg.complete) {
        ctx.drawImage(monkeyImg, monkey.x, monkey.y, monkey.width, monkey.height);
    } else {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(monkey.x, monkey.y, monkey.width, monkey.height);
    }
}

function drawTrees() {
    trees.forEach(tree => {
        if (tree.y === 0 && treeTopImg.complete) {
            ctx.drawImage(treeTopImg, tree.x, tree.y, tree.width, tree.height);
        } else if (treeBottomImg.complete) {
            ctx.drawImage(treeBottomImg, tree.x, tree.y, tree.width, tree.height);
        } else {
            ctx.fillStyle = '#228B22';
            ctx.fillRect(tree.x, tree.y, tree.width, tree.height);
        }
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '24px Poppins';
    ctx.fillText(`Score: ${score}`, 20, 40);
}

function startGame() {
    gameRunning = true;
    score = 0;
    trees.length = 0;
    monkey.y = canvas.height / 2;
    monkey.velocity = 0;
    startScreen.style.opacity = '0';
    setTimeout(() => {
        startScreen.style.display = 'none';
    }, 300);
}

function gameOver() {
    gameRunning = false;
    startScreen.style.display = 'flex';
    setTimeout(() => {
        startScreen.style.opacity = '1';
    }, 10);
}

// Event Handlers
function handleKeyDown(e) {
    if (e.code === 'Space') {
        if (!gameRunning) {
            startGame();
        } else {
            monkey.velocity = JUMP_FORCE;
        }
    }
}

function handleClick() {
    if (!gameRunning) {
        startGame();
    } else {
        monkey.velocity = JUMP_FORCE;
    }
}

// Start the game
init();