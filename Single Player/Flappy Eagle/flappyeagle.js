// Flappy Eagle - 4th of July Edition
// Based on ImKennyYip/flappy-bird, but with eagle and firework assets

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
let velocityX = -2; //fireworks moving left speed
let velocityY = 0; //eagle jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

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
    setInterval(placeFireworks, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveEagle);
    document.addEventListener("mousedown", jumpEagle);
    document.addEventListener("touchstart", jumpEagle);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Draw background first
    if (backgroundImg && backgroundImg.complete) {
        context.drawImage(backgroundImg, 0, 0, board.width, board.height);
    }

    //eagle
    velocityY += gravity;
    eagle.y = Math.max(eagle.y + velocityY, 0); //apply gravity to current eagle.y, limit the eagle.y to top of the canvas
    context.drawImage(eagleImg, eagle.x, eagle.y, eagle.width, eagle.height);

    if (eagle.y > board.height) {
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

    //score
    context.fillStyle = "black";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER!", 5, 90);
        context.font="24px sans-serif";
        context.fillText("Press Space or Click to Restart", 5, 130);
    }
}

function placeFireworks() {
    if (gameOver) {
        return;
    }

    let randomFireworkY = fireworkY - fireworkHeight/4 - Math.random()*(fireworkHeight/2);
    let openingSpace = board.height/4;

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
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            eagle.y = eagleY;
            fireworkArray = [];
            score = 0;
            gameOver = false;
            velocityY = 0;
        }
    }
}

function jumpEagle(e) {
    if (!gameOver) {
        velocityY = -6;
    } else {
        eagle.y = eagleY;
        fireworkArray = [];
        score = 0;
        gameOver = false;
        velocityY = 0;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
