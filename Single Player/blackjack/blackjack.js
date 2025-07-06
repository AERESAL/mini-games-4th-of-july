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
    document.getElementById("your-cards").append(cardImg);    if (reduceAce(yourSum, yourAceCount).sum > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

    // Show updated score
    document.getElementById("your-score").innerText = yourSum;
}

function stay() {
    let dealerResult = reduceAce(dealerSum, dealerAceCount);
    dealerSum = dealerResult.sum;
    dealerAceCount = dealerResult.aceCount;
    
    let yourResult = reduceAce(yourSum, yourAceCount);
    yourSum = yourResult.sum;
    yourAceCount = yourResult.aceCount;
    
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
        let cardValue = getValue(card);
        let cardAceCount = checkAce(card);
        
        dealerSum += cardValue;
        dealerAceCount += cardAceCount;
        
        // Reduce aces if needed after adding the new card
        let result = reduceAce(dealerSum, dealerAceCount);
        dealerSum = result.sum;
        dealerAceCount = result.aceCount;
        
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
    // Map card code to blackjack cards folder images
    // card: e.g. 'A-C', '10-H', 'J-S', or 'BACK'
    if (card === 'BACK') {
        // Return a solid color instead of trying to load an image
        return 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="112"><rect width="80" height="112" fill="#b71c1c"/></svg>');
    }    // Card image mapping for blackjack cards - exactly 52 unique cards mapped to 52 files
    const cardImageMap = {
        'A-S': 'black jack cards_01.png', '2-S': 'black jack cards_02.png', '3-S': 'black jack cards_03.png', '4-S': 'black jack cards_04.png', '5-S': 'black jack cards_05.png', '6-S': 'black jack cards_06.png', '7-S': 'black jack cards_07.png', '8-S': 'black jack cards_08.png', '9-S': 'black jack cards_09.png', '10-S': 'black jack cards_10.png', 'J-S': 'black jack cards_11.png', 'Q-S': 'black jack cards_13.png', 'K-S': 'black jack cards_14.png',
        'A-D': 'black jack cards_16.png', '2-D': 'black jack cards_17.png', '3-D': 'black jack cards_18.png', '4-D': 'black jack cards_20.png', '5-D': 'black jack cards_21.png', '6-D': 'black jack cards_23.png', '7-D': 'black jack cards_24.png', '8-D': 'black jack cards_27.png', '9-D': 'black jack cards_28.png', '10-D': 'black jack cards_29.png', 'J-D': 'black jack cards_30.png', 'Q-D': 'black jack cards_32.png', 'K-D': 'black jack cards_33.png',
        'A-C': 'black jack cards_35.png', '2-C': 'black jack cards_36.png', '3-C': 'black jack cards_39.png', '4-C': 'black jack cards_40.png', '5-C': 'black jack cards_41.png', '6-C': 'black jack cards_42.png', '7-C': 'black jack cards_43.png', '8-C': 'black jack cards_44.png', '9-C': 'black jack cards_47.png', '10-C': 'black jack cards_48.png', 'J-C': 'black jack cards_49.png', 'Q-C': 'black jack cards_50.png', 'K-C': 'black jack cards_51.png',
        'A-H': 'black jack cards_52.png', '2-H': 'black jack cards_53.png', '3-H': 'black jack cards_54.png', '4-H': 'black jack cards_55.png', '5-H': 'black jack cards_56.png', '6-H': 'black jack cards_58.png', '7-H': 'black jack cards_59.png', '8-H': 'black jack cards_60.png', '9-H': 'black jack cards_61.png', '10-H': 'black jack cards_62.png', 'J-H': 'black jack cards_63.png', 'Q-H': 'black jack cards_64.png', 'K-H': 'black jack cards_65.png'
    };    // Get the card image filename
    const cardImg = cardImageMap[card];
    if (cardImg) {
        return `../../assets/cards/images/${cardImg}`;
    }
    
    // fallback to first card if mapping fails
    return '../../assets/cards/images/black jack cards_01.png';
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
    return { sum: playerSum, aceCount: playerAceCount };
}
