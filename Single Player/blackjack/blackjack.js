let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;

let canHit = true; //allows the player (you) to draw while yourSum <= 21

window.onload = function() {
    // Set blackjack themed background
    document.body.style.backgroundImage = 'url("../../assets/blackjackbackground.png")';
    document.body.style.backgroundSize = 'contain';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';

    buildDeck();
    shuffleDeck();
    startGame();
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stay);
    document.getElementById("play-again").addEventListener("click", function() {
        resetGame();
    });
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    // Dealer gets 2 cards
    let dealerCard1 = deck.pop();
    let dealerCard2 = deck.pop();
    hidden = dealerCard1; // first card is hidden
    dealerSum = getValue(dealerCard1) + getValue(dealerCard2);
    dealerAceCount = checkAce(dealerCard1) + checkAce(dealerCard2);
    // Show only the second card, but keep a placeholder for the hidden card
    let hiddenCardImg = document.createElement("img");
    hiddenCardImg.src = getCardImagePath('BACK');
    hiddenCardImg.id = "hidden-card";
    document.getElementById("dealer-cards").append(hiddenCardImg);
    let cardImg = document.createElement("img");
    cardImg.src = getCardImagePath(dealerCard2);
    document.getElementById("dealer-cards").append(cardImg);

    // Player gets 2 cards
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = getCardImagePath(card);
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = getCardImagePath(card);
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

    // Show updated score
    document.getElementById("your-score").innerText = yourSum;
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
    canHit = false;
    // Reveal hidden card
    let dealerCardsDiv = document.getElementById("dealer-cards");
    let hiddenImg = document.createElement("img");
    hiddenImg.src = getCardImagePath(hidden);
    // Replace the placeholder with the real card
    let hiddenCardElem = document.getElementById("hidden-card");
    dealerCardsDiv.replaceChild(hiddenImg, hiddenCardElem);
    // Dealer draws until 17 or more
    while (dealerSum < 17) {
        let card = deck.pop();
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        let cardImg = document.createElement("img");
        cardImg.src = getCardImagePath(card);
        dealerCardsDiv.appendChild(cardImg);
    }
    // ...existing code for result...
    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You win!";
    }
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
    }
    document.getElementById("dealer-score").innerText = dealerSum;
    document.getElementById("your-score").innerText = yourSum;
    document.getElementById("result").innerText = message;
    document.getElementById("play-again").style.display = "inline-block";
}

function resetGame() {
    // Clear hands and scores
    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("dealer-score").innerText = "";
    document.getElementById("your-score").innerText = "";
    document.getElementById("result").innerText = "";
    document.getElementById("play-again").style.display = "none";
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;
    buildDeck();
    shuffleDeck();
    startGame();
}

// Helper to get card image path
function getCardImagePath(card) {
    // Map card code to blackjackPIL.py output naming
    // card: e.g. 'A-C', '10-H', 'J-S', or 'BACK'
    if (card === 'BACK') {
        return '../../assets/cards/BACK.png';
    }
    const rankMap = {
        'A': 'ace', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7',
        '8': '8', '9': '9', '10': '10', 'J': 'jack', 'Q': 'queen', 'K': 'king'
    };
    const suitMap = {
        'S': 'spades', 'D': 'diamonds', 'C': 'clubs', 'H': 'hearts'
    };
    if (card.includes('-')) {
        const [rank, suit] = card.split('-');
        return `../../assets/cards/${suitMap[suit]}_${rankMap[rank]}.png`;
    } else if (card.includes('_')) {
        // Already in the correct format
        return `../../assets/cards/${card}.png`;
    }
    // fallback
    return '../../assets/cards/BACK.png';
}

function getValue(card) {
    // Accepts both 'A-C' and 'spades_ace' style filenames
    let value;
    if (card.includes('-')) {
        // e.g. 'A-C', '10-H', etc.
        value = card.split('-')[0];
    } else if (card.includes('_')) {
        // e.g. 'spades_ace', 'hearts_10', etc.
        value = card.split('_')[1];
        // Map word values to numbers
        if (value === 'ace') value = 'A';
        if (value === 'jack') value = 'J';
        if (value === 'queen') value = 'Q';
        if (value === 'king') value = 'K';
    }
    if (value === undefined) return 0;
    if (isNaN(value)) { //A J Q K
        if (value === "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}
