// 🦅 Flappy Eagle - 4th of July Edition 🎆
// Patriotic eagle flying through fireworks!

//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//eagle
let eagleWidth = 34; //width/height ratio = 408/228 = 17/12
let eagleHeight = 24;
let eagleX = boardWidth/8;
let eagleY = boardHeight/2;
let eagleImg;

let eagle = {
    x : eagleX,
    y : eagleY,
    width : eagleWidth,
    height : eagleHeight
}

//fireworks
let fireworkArray = [];
let fireworkWidth = 64; //width/height ratio = 384/3072 = 1/8
let fireworkHeight = 512;
let fireworkX = boardWidth;
let fireworkY = 0;

let fireworkImg;
//background
let backgroundImg;

// Patriotic effects
let starTrails = [];
let patrioticParticles = [];

//physics
let velocityX = -2.5; //fireworks moving left speed (slightly faster)
let velocityY = 0; //eagle jump speed
let gravity = 0.4; //improved gravity for better feel
let jumpStrength = -6; //stronger jump for better control
let maxFallSpeed = 6; //terminal velocity to prevent falling too fast

let gameOver = false;
let score = 0;
let gameStarted = false; //track if game has started

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //load images
    eagleImg = new Image();
    eagleImg.src = "../../assets/EagleWingDown.bmp";
    eagleImg.onload = function() {
        context.drawImage(eagleImg, eagle.x, eagle.y, eagle.width, eagle.height);
    }

    fireworkImg = new Image();
    fireworkImg.src = "../../assets/firework.png";

    backgroundImg = new Image();
    backgroundImg.src = "../../assets/background.png";

    requestAnimationFrame(update);
    setInterval(placeFireworks, 2000); //balanced interval for good difficulty
    document.addEventListener("keydown", moveEagle);
    document.addEventListener("mousedown", jumpEagle);
    document.addEventListener("touchstart", jumpEagle);
}

function update() {
    requestAnimationFrame(update);
    
    // Draw patriotic sky gradient background
    let gradient = context.createLinearGradient(0, 0, 0, boardHeight);
    gradient.addColorStop(0, "#87CEEB");     // Sky blue
    gradient.addColorStop(0.3, "#B0E0E6");  // Light sky blue  
    gradient.addColorStop(0.7, "#F0F8FF");  // Alice blue
    gradient.addColorStop(1, "#FFFFFF");    // White
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, boardWidth, boardHeight);
    
    // Add patriotic star field
    drawPatrioticStars();

    // Draw background if available
    if (backgroundImg && backgroundImg.complete) {
        context.globalAlpha = 0.3; // Make background semi-transparent
        context.drawImage(backgroundImg, 0, 0, board.width, board.height);
        context.globalAlpha = 1.0; // Reset alpha
    }

    // Show start message if game hasn't started
    if (!gameStarted && !gameOver) {
        drawPatrioticText("🦅 PRESS SPACE OR CLICK TO START! 🦅", boardWidth/2, boardHeight/2 - 30, "24px", "#dc143c");
        drawPatrioticText("Guide the eagle through fireworks!", boardWidth/2, boardHeight/2 + 10, "18px", "#002868");
        drawPatrioticText("🎆 Happy 4th of July! 🎆", boardWidth/2, boardHeight/2 + 50, "20px", "#ffffff");
        context.drawImage(eagleImg, eagle.x, eagle.y, eagle.width, eagle.height);
        return;
    }

    if (gameOver) {
        // Still show eagle and fireworks when game over
        context.drawImage(eagleImg, eagle.x, eagle.y, eagle.width, eagle.height);
        
        for (let i = 0; i < fireworkArray.length; i++) {
            let firework = fireworkArray[i];
            context.drawImage(firework.img, firework.x, firework.y, firework.width, firework.height);
        }
        
        // Patriotic game over screen
        context.fillStyle = "rgba(0, 40, 104, 0.8)";
        context.fillRect(0, boardHeight/2 - 100, boardWidth, 200);
        
        // Add patriotic border
        context.strokeStyle = "#dc143c";
        context.lineWidth = 4;
        context.strokeRect(10, boardHeight/2 - 90, boardWidth - 20, 180);
        
        drawPatrioticText("🦅 GAME OVER! 🦅", boardWidth/2, boardHeight/2 - 40, "32px", "#ffffff");
        drawPatrioticText("Final Score: " + score, boardWidth/2, boardHeight/2, "20px", "#ffffff");
        drawPatrioticText("🎆 Press Space to Restart 🎆", boardWidth/2, boardHeight/2 + 40, "16px", "#ffffff");
        
        // Show current score in corner with patriotic styling
        drawPatrioticText(score.toString(), 25, 40, "28px", "#dc143c");
        return;
    }

    // Update and draw patriotic particles
    updatePatrioticParticles();

    //eagle physics with smoother movement
    velocityY += gravity;
    
    // Add terminal velocity to prevent eagle from falling too fast
    if (velocityY > maxFallSpeed) {
        velocityY = maxFallSpeed;
    }
    
    eagle.y = Math.max(eagle.y + velocityY, 0); //apply gravity, limit to top of canvas
    
    // Add eagle trail effect
    if (Math.random() < 0.3) {
        addEagleTrail();
    }
    
    context.drawImage(eagleImg, eagle.x, eagle.y, eagle.width, eagle.height);

    // Check if eagle hits bottom
    if (eagle.y > board.height - eagle.height) {
        gameOver = true;
    }

    //fireworks
    for (let i = 0; i < fireworkArray.length; i++) {
        let firework = fireworkArray[i];
        firework.x += velocityX;
        context.drawImage(firework.img, firework.x, firework.y, firework.width, firework.height);

        if (!firework.passed && eagle.x > firework.x + firework.width) {
            score += 0.5; //0.5 because there are 2 fireworks! so 0.5*2 = 1, 1 for each set of fireworks
            firework.passed = true;
            // Add celebration particles when scoring
            addScoreParticles(eagle.x, eagle.y);
        }

        if (detectCollision(eagle, firework)) {
            gameOver = true;
        }
    }

    //clear fireworks
    while (fireworkArray.length > 0 && fireworkArray[0].x < -fireworkWidth) {
        fireworkArray.shift(); //removes first element from the array
    }

    // Display score with patriotic styling
    drawPatrioticText(score.toString(), 25, 40, "28px", "#dc143c");
}
            let firework = fireworkArray[i];
            context.drawImage(firework.img, firework.x, firework.y, firework.width, firework.height);
        
        
        // Game over text with better styling
        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, boardHeight/2 - 80, boardWidth, 160);
        
        context.fillStyle = "white";
        context.font = "36px sans-serif";
        context.textAlign = "center";
        context.fillText("GAME OVER!", boardWidth/2, boardHeight/2 - 20);
        
        context.font = "18px sans-serif";
        context.fillText("Final Score: " + score, boardWidth/2, boardHeight/2 + 20);
        context.fillText("Press Space to Restart", boardWidth/2, boardHeight/2 + 50);
        
        context.textAlign = "left"; // reset text alignment
        
        // Show current score in corner
        context.fillStyle = "white";
        context.font = "32px sans-serif";
        context.fillText(score, 15, 40);
        return;
    

    //eagle physics with smoother movement
    velocityY += gravity;
    
    // Add terminal velocity to prevent eagle from falling too fast
    if (velocityY > maxFallSpeed) {
        velocityY = maxFallSpeed;
    }
    
    eagle.y = Math.max(eagle.y + velocityY, 0); //apply gravity, limit to top of canvas
    context.drawImage(eagleImg, eagle.x, eagle.y, eagle.width, eagle.height);

    // Check if eagle hits bottom
    if (eagle.y > board.height - eagle.height) {
        gameOver = true;
    }

    //fireworks
    for (let i = 0; i < fireworkArray.length; i++) {
        let firework = fireworkArray[i];
        firework.x += velocityX;
        context.drawImage(firework.img, firework.x, firework.y, firework.width, firework.height);

        if (!firework.passed && eagle.x > firework.x + firework.width) {
            score += 0.5; //0.5 because there are 2 fireworks! so 0.5*2 = 1, 1 for each set of fireworks
            firework.passed = true;
        }

        if (detectCollision(eagle, firework)) {
            gameOver = true;
        }
    }

    //clear fireworks
    while (fireworkArray.length > 0 && fireworkArray[0].x < -fireworkWidth) {
        fireworkArray.shift(); //removes first element from the array
    }

    //score display with better styling
    context.fillStyle = "white";
    context.strokeStyle = "black";
    context.lineWidth = 3;
    context.font = "32px sans-serif";
    context.strokeText(score, 15, 40);
    context.fillText(score, 15, 40);


// 🇺🇸 Patriotic helper functions 🇺🇸
function drawPatrioticText(text, x, y, fontSize, color) {
    context.save();
    context.font = fontSize + " Impact, Arial Black, sans-serif";
    context.textAlign = "center";
    context.fillStyle = color;
    context.strokeStyle = "rgba(0, 0, 0, 0.8)";
    context.lineWidth = 2;
    context.strokeText(text, x, y);
    context.fillText(text, x, y);
    context.restore();
}

function drawPatrioticStars() {
    // Draw animated patriotic stars
    for (let i = 0; i < 15; i++) {
        let x = (Date.now() * 0.01 + i * 30) % (boardWidth + 20);
        let y = 20 + (i * 25) % (boardHeight - 40);
        let size = 2 + Math.sin(Date.now() * 0.005 + i) * 1;
        
        context.fillStyle = i % 3 === 0 ? "#dc143c" : 
                           i % 3 === 1 ? "#ffffff" : "#002868";
        context.globalAlpha = 0.6 + Math.sin(Date.now() * 0.008 + i) * 0.3;
        
        // Draw star shape
        drawStar(x, y, 5, size, size * 0.5);
    }
    context.globalAlpha = 1.0;
}

function drawStar(x, y, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let cx = x;
    let cy = y;
    let step = Math.PI / spikes;

    context.beginPath();
    context.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        let x1 = cx + Math.cos(rot) * outerRadius;
        let y1 = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x1, y1);
        rot += step;

        x1 = cx + Math.cos(rot) * innerRadius;
        y1 = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x1, y1);
        rot += step;
    }
    
    context.lineTo(cx, cy - outerRadius);
    context.closePath();
    context.fill();
}

function addEagleTrail() {
    starTrails.push({
        x: eagle.x + eagle.width/2,
        y: eagle.y + eagle.height/2,
        life: 30,
        maxLife: 30
    });
}

function addScoreParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        patrioticParticles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 60,
            maxLife: 60,
            color: i % 3 === 0 ? "#dc143c" : i % 3 === 1 ? "#ffffff" : "#002868"
        });
    }
}

function updatePatrioticParticles() {
    // Update star trails
    for (let i = starTrails.length - 1; i >= 0; i--) {
        let trail = starTrails[i];
        trail.life--;
        
        if (trail.life <= 0) {
            starTrails.splice(i, 1);
            continue;
        }
        
        let alpha = trail.life / trail.maxLife;
        context.globalAlpha = alpha * 0.6;
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(trail.x, trail.y, 2 * alpha, 0, Math.PI * 2);
        context.fill();
    }
    
    // Update patriotic particles
    for (let i = patrioticParticles.length - 1; i >= 0; i--) {
        let particle = patrioticParticles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        if (particle.life <= 0) {
            patrioticParticles.splice(i, 1);
            continue;
        }
        
        let alpha = particle.life / particle.maxLife;
        context.globalAlpha = alpha;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, 3 * alpha, 0, Math.PI * 2);
        context.fill();
    }
    
    context.globalAlpha = 1.0;
}


function placeFireworks() {
    if (gameOver || !gameStarted) {
        return;
    }

    let randomFireworkY = fireworkY - fireworkHeight/4 - Math.random()*(fireworkHeight/2);
    let openingSpace = board.height/3.5; // Slightly larger opening for better gameplay

    let topFirework = {
        img : fireworkImg,
        x : fireworkX,
        y : randomFireworkY,
        width : fireworkWidth,
        height : fireworkHeight,
        passed : false
    }
    fireworkArray.push(topFirework);

    let bottomFirework = {
        img : fireworkImg,
        x : fireworkX,
        y : randomFireworkY + fireworkHeight + openingSpace,
        width : fireworkWidth,
        height : fireworkHeight,
        passed : false
    }
    fireworkArray.push(bottomFirework);
}

function moveEagle(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        e.preventDefault(); // Prevent page scrolling
        
        if (!gameStarted && !gameOver) {
            gameStarted = true;
        }
        
        if (!gameOver) {
            //jump with improved strength
            velocityY = jumpStrength;
        }

        //reset game
        if (gameOver) {
            eagle.y = eagleY;
            fireworkArray = [];
            score = 0;
            gameOver = false;
            gameStarted = false;
            velocityY = 0;
        }
    }
}

function jumpEagle(e) {
    e.preventDefault(); // Prevent default touch/click behavior
    
    if (!gameStarted && !gameOver) {
        gameStarted = true;
    }
    
    if (!gameOver) {
        velocityY = jumpStrength;
    } else {
        // Reset game
        eagle.y = eagleY;
        fireworkArray = [];
        score = 0;
        gameOver = false;
        gameStarted = false;
        velocityY = 0;
    }
}

function detectCollision(a, b) {
    // Slightly smaller hitbox for more forgiving gameplay
    let margin = 4;
    return a.x + margin < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width - margin > b.x &&   //a's top right corner passes b's top left corner
           a.y + margin < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height - margin > b.y;    //a's bottom left corner passes b's top left corner
}
