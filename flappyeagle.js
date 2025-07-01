// game.js
// Flappy Eagle core logic

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const eagleDown = new Image();
eagleDown.src = 'assets/EagleWingDown.bmp';

const eagleUp = new Image();
eagleUp.src = 'assets/EagleWingUp.bmp';

// Load pipe sprite
const pipeImg = new Image();
pipeImg.src = 'assets/firework.png';

let eagleY = 250;
let velocity = 0;
const gravity = 0.05; // Slightly more aggressive gravity for a faster fall
const flapStrength = -2.2; // Even gentler jump

let isFlapping = false;

let score = 0;
let passedPipe = false;
let gameOver = false;

// Pipe settings
const pipeWidth = 60;
const pipeGap = 150;
const pipeSpacing = 250; // Distance between pipes
let pipes = [];

// Set the background color to match the eagle sprite's background (assuming white)
canvas.style.background = '#ffffff';
canvas.style.display = 'block';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.margin = '0';
canvas.style.padding = '0';
canvas.style.border = 'none';
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function resetGame() {
  eagleY = canvas.height / 2 - eagleHeight / 2;
  velocity = 0;
  score = 0;
  pipes = [];
  // Spawn multiple pipes at start
  for (let i = 0; i < 3; i++) {
    pipes.push({
      x: canvas.width + i * pipeSpacing,
      gapY: Math.random() * (canvas.height - pipeGap * 2) + pipeGap
    });
  }
  passedPipe = false;
  gameOver = false;
}

// Ensure eagleHeight is defined before use
const eagleWidth = 40;
const eagleHeight = 40;
const eagleX = () => (canvas.width / 2 - eagleWidth / 2);

let flapTimeout = null;
let flapLocked = false;

function flap() {
  if (flapLocked) return; // Prevent new flap until timeout is over
  velocity = flapStrength;
  isFlapping = true;
  flapLocked = true;
  clearTimeout(flapTimeout);
  flapTimeout = setTimeout(() => {
    isFlapping = false;
    flapLocked = false;
  }, 200); // 0.2 seconds
}

// Listen for spacebar as well as mouse/touch
canvas.addEventListener('mousedown', flap);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  flap();
});
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    flap();
    // Also trigger click event for game restart if game over
    if (gameOver) {
      handleRestart();
    }
  }
});

function checkCollision() {
  // Eagle rectangle
  const eagleRect = { x: eagleX(), y: eagleY, w: eagleWidth, h: eagleHeight };
  // Ground or ceiling
  if (eagleY + eagleHeight > canvas.height || eagleY < 0) {
    return true;
  }
  // Pipes
  for (let pipe of pipes) {
    // Top pipe
    if (
      eagleRect.x + eagleRect.w > pipe.x &&
      eagleRect.x < pipe.x + pipeWidth &&
      eagleRect.y < pipe.gapY - pipeGap / 2
    ) {
      return true;
    }
    // Bottom pipe
    if (
      eagleRect.x + eagleRect.w > pipe.x &&
      eagleRect.x < pipe.x + pipeWidth &&
      eagleRect.y + eagleRect.h > pipe.gapY + pipeGap / 2
    ) {
      return true;
    }
  }
  return false;
}

function update() {
  if (gameOver) return;
  velocity += gravity;
  eagleY += velocity;

  // Move pipes
  for (let pipe of pipes) {
    pipe.x -= 2;
  }

  // Add new pipe if needed
  if (pipes.length < 3 || pipes[pipes.length - 1].x < canvas.width - pipeSpacing) {
    pipes.push({
      x: pipes[pipes.length - 1].x + pipeSpacing,
      gapY: Math.random() * (canvas.height - pipeGap * 2) + pipeGap
    });
  }

  // Remove off-screen pipes
  if (pipes[0].x < -pipeWidth) {
    pipes.shift();
    passedPipe = false;
  }

  // Scoring
  for (let pipe of pipes) {
    if (!pipe.passed && pipe.x + pipeWidth < eagleX() + eagleWidth / 2) {
      score++;
      pipe.passed = true;
    }
  }

  if (checkCollision()) {
    gameOver = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw pipes using firework.png
  for (let pipe of pipes) {
    // Top pipe
    ctx.save();
    ctx.translate(pipe.x, pipe.gapY - pipeGap / 2);
    ctx.scale(1, -1); // Flip for top pipe
    ctx.drawImage(pipeImg, 0, 0, pipeWidth, pipe.gapY - pipeGap / 2);
    ctx.restore();
    // Bottom pipe
    ctx.drawImage(pipeImg, pipe.x, pipe.gapY + pipeGap / 2, pipeWidth, canvas.height - pipe.gapY - pipeGap / 2);
  }
  // Draw eagle centered
  const eagleSprite = isFlapping ? eagleDown : eagleUp;
  ctx.drawImage(eagleSprite, eagleX(), eagleY, eagleWidth, eagleHeight);
  // Draw score (now black for visibility)
  ctx.fillStyle = 'black';
  ctx.font = 'bold 40px Arial';
  ctx.fillText(score, canvas.width / 2 - 10, 60);

  // Draw game over
  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2 - 20);
    ctx.font = '28px Arial';
    ctx.fillText('Score: ' + score, canvas.width / 2 - 60, canvas.height / 2 + 30);
    ctx.font = '20px Arial';
    ctx.fillText('Click or Tap to Restart', canvas.width / 2 - 100, canvas.height / 2 + 70);
  }
}

function handleRestart() {
  if (gameOver) {
    resetGame();
    gameOver = false;
  }
}

canvas.addEventListener('mousedown', handleRestart);
canvas.addEventListener('touchstart', (e) => {
  handleRestart();
});

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

eagleDown.onload = () => {
  eagleUp.onload = () => {
    resetGame(); // Ensure game state is initialized before starting loop
    gameLoop();
  };
};
