const canvas = document.getElementById('gameCanvas');
canvas.width = 400;
canvas.height = 600;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

function resizeCanvas() {
  const aspect = 400 / 600;
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w / h > aspect) {
    w = h * aspect;
  } else {
    h = w / aspect;
  }
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  // Center the canvas using absolute positioning
  canvas.style.position = 'absolute';
  canvas.style.left = ((window.innerWidth - w) / 2) + 'px';
  canvas.style.top = ((window.innerHeight - h) / 2) + 'px';
  canvas.style.margin = '0';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const eagleDown = new Image();
eagleDown.src = '../../assets/EagleWingDown.bmp';

const eagleUp = new Image();
eagleUp.src = '../../assets/EagleWingUp.bmp';

const pipeImg = new Image();
pipeImg.src = '../../assets/firework.bmp';

let eagleY = 250;
let velocity = 0;
const gravity = 0.5;
const flapStrength = -8;

let isFlapping = false;
let flapCooldown = 0;

let score = 0;
let passedPipe = false;
let gameOver = false;

const pipeWidth = 60;
const pipeGap = 150;
let pipes = [
  { x: 400, gapY: Math.random() * 300 + 100 }
];

function resetGame() {
  eagleY = 250;
  velocity = 0;
  score = 0;
  pipes = [{ x: 400, gapY: Math.random() * 300 + 100 }];
  passedPipe = false;
  gameOver = false;
}

function flap() {
  velocity = flapStrength;
  isFlapping = true;
  flapCooldown = 5; // frames to show "flap" sprite
}

canvas.addEventListener('mousedown', flap);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  flap();
}, { passive: false });

function checkCollision() {
  const eagleRect = { x: 100, y: eagleY, w: 40, h: 40 };
  if (eagleY + 40 > canvas.height || eagleY < 0) {
    return true;
  }
  for (let pipe of pipes) {
    if (
      eagleRect.x + eagleRect.w > pipe.x &&
      eagleRect.x < pipe.x + pipeWidth &&
      eagleRect.y < pipe.gapY - pipeGap / 2
    ) {
      return true;
    }
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

  for (let pipe of pipes) {
    pipe.x -= 2;
  }

  if (pipes[pipes.length - 1].x < 200) {
    pipes.push({ x: 400, gapY: Math.random() * 300 + 100 });
  }

  // Remove off-screen pipes
  if (pipes[0].x < -pipeWidth) {
    pipes.shift();
    passedPipe = false;
  }

  // Scoring
  if (!passedPipe && pipes[0].x + pipeWidth < 100) {
    score++;
    passedPipe = true;
  }

  if (flapCooldown > 0) {
    flapCooldown--;
  } else {
    isFlapping = false;
  }

  if (checkCollision()) {
    gameOver = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw pipes using firework.png, top pipe rotated 180deg
  for (let pipe of pipes) {
    // Top pipe (rotated)
    let topPipeHeight = pipe.gapY - pipeGap / 2;
    if (topPipeHeight > 0) {
      let y = topPipeHeight - pipeImg.height;
      while (y > 0 - pipeImg.height) {
        ctx.save();
        ctx.translate(pipe.x + pipeWidth / 2, y + pipeImg.height / 2);
        ctx.rotate(Math.PI); // 180 degrees
        ctx.drawImage(pipeImg, -pipeWidth / 2, -pipeImg.height / 2, pipeWidth, pipeImg.height);
        ctx.restore();
        y -= pipeImg.height;
      }
    }
    // Bottom pipe (normal)
    let bottomPipeY = pipe.gapY + pipeGap / 2;
    let y = bottomPipeY;
    while (y < canvas.height) {
      ctx.drawImage(pipeImg, pipe.x, y, pipeWidth, pipeImg.height);
      y += pipeImg.height;
    }
  }
  // Draw eagle
  const eagleSprite = isFlapping ? eagleUp : eagleDown;
  ctx.drawImage(eagleSprite, 100, eagleY, 40, 40);
  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '32px Arial';
  ctx.fillText(score, canvas.width / 2 - 10, 50);

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
}, { passive: false });

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

eagleDown.onload = () => {
  eagleUp.onload = () => {
    gameLoop();
  };
};
