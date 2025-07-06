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
    eagleImg.src = "../../assets/eagles.png";
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
    
    // Draw background if available
    if (backgroundImg && backgroundImg.complete) {
        context.drawImage(backgroundImg, 0, 0, board.width, board.height);
    } else {
        context.fillStyle = "#87CEEB"; // fallback sky blue
        context.fillRect(0, 0, boardWidth, boardHeight);
    }

    // Show start message if game hasn't started
    if (!gameStarted && !gameOver) {
        context.fillStyle = "#dc143c";
        context.font = "24px Impact, Arial Black, sans-serif";
        context.textAlign = "center";
        context.fillText("🦅 PRESS SPACE OR CLICK TO START! 🦅", boardWidth/2, boardHeight/2 - 30);
        context.fillStyle = "#002868";
        context.font = "18px Impact, Arial Black, sans-serif";
        context.fillText("Guide the eagle through fireworks!", boardWidth/2, boardHeight/2 + 10);
        context.fillStyle = "#ffffff";
        context.font = "20px Impact, Arial Black, sans-serif";
        context.fillText("🎆 Happy 4th of July! 🎆", boardWidth/2, boardHeight/2 + 50);
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
    }

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
