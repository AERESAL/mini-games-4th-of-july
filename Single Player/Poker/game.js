// Poker Game Class
class PokerGame {
    constructor() {
        this.suits = ['♠', '♥', '♦', '♣'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = [];
        this.playerHand = [];
        this.computerHand = [];
        this.selectedCards = [];
        this.playerScore = 0;
        this.computerScore = 0;
        this.roundCount = 1;
        this.gameState = 'start'; // 'start', 'selecting', 'ready', 'revealed'
        
        this.initGame();
    }
    
    initGame() {
        this.createDeck();
        this.shuffleDeck();
        this.dealInitialHands();
        this.updateUI();
    }
    
    createDeck() {
        this.deck = [];
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                this.deck.push({
                    suit: suit,
                    rank: rank,
                    value: this.getCardValue(rank)
                });
            }
        }
    }
    
    getCardValue(rank) {
        if (rank === 'A') return 14;
        if (rank === 'K') return 13;
        if (rank === 'Q') return 12;
        if (rank === 'J') return 11;
        return parseInt(rank);
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    dealInitialHands() {
        this.playerHand = [];
        this.computerHand = [];
        
        // Deal 5 cards to each player
        for (let i = 0; i < 5; i++) {
            this.playerHand.push(this.deck.pop());
            this.computerHand.push(this.deck.pop());
        }
    }
    
    replacePlayerCards(indices) {
        // Replace selected cards with new ones from deck
        for (let index of indices.sort((a, b) => b - a)) {
            if (index >= 0 && index < this.playerHand.length) {
                this.playerHand[index] = this.deck.pop();
            }
        }
    }
    
    computerReplaceCards() {
        // Simple AI: Keep pairs, three of a kind, etc.
        const hand = this.computerHand.map(card => card.value);
        const counts = {};
        
        // Count occurrences of each card value
        for (let value of hand) {
            counts[value] = (counts[value] || 0) + 1;
        }
        
        // Determine which cards to keep
        const keepValues = [];
        for (let value in counts) {
            if (counts[value] >= 2) {
                keepValues.push(parseInt(value));
            }
        }
        
        // If no pairs, keep high cards (10 or higher)
        if (keepValues.length === 0) {
            for (let card of this.computerHand) {
                if (card.value >= 10) {
                    keepValues.push(card.value);
                }
            }
        }
        
        // Replace cards not in keepValues (max 3 cards)
        const replaceIndices = [];
        for (let i = 0; i < this.computerHand.length; i++) {
            if (!keepValues.includes(this.computerHand[i].value)) {
                replaceIndices.push(i);
            }
        }
        
        // Limit to 3 replacements
        const toReplace = replaceIndices.slice(0, 3);
        for (let index of toReplace.sort((a, b) => b - a)) {
            this.computerHand[index] = this.deck.pop();
        }
    }
    
    evaluateHand(hand) {
        const values = hand.map(card => card.value).sort((a, b) => a - b);
        const suits = hand.map(card => card.suit);
        const counts = {};
        
        // Count occurrences of each value
        for (let value of values) {
            counts[value] = (counts[value] || 0) + 1;
        }
        
        const countValues = Object.values(counts).sort((a, b) => b - a);
        const isFlush = suits.every(suit => suit === suits[0]);
        const isStraight = this.isStraight(values);
        
        // Check for each hand type
        if (isStraight && isFlush) {
            if (values.join('') === '10,11,12,13,14') {
                return { rank: 10, name: 'Royal Flush', highCard: 14 };
            }
            return { rank: 9, name: 'Straight Flush', highCard: Math.max(...values) };
        }
        
        if (countValues[0] === 4) {
            return { rank: 8, name: 'Four of a Kind', highCard: this.getHighCard(counts, 4) };
        }
        
        if (countValues[0] === 3 && countValues[1] === 2) {
            return { rank: 7, name: 'Full House', highCard: this.getHighCard(counts, 3) };
        }
        
        if (isFlush) {
            return { rank: 6, name: 'Flush', highCard: Math.max(...values) };
        }
        
        if (isStraight) {
            return { rank: 5, name: 'Straight', highCard: Math.max(...values) };
        }
        
        if (countValues[0] === 3) {
            return { rank: 4, name: 'Three of a Kind', highCard: this.getHighCard(counts, 3) };
        }
        
        if (countValues[0] === 2 && countValues[1] === 2) {
            return { rank: 3, name: 'Two Pair', highCard: this.getHighCard(counts, 2) };
        }
        
        if (countValues[0] === 2) {
            return { rank: 2, name: 'One Pair', highCard: this.getHighCard(counts, 2) };
        }
        
        return { rank: 1, name: 'High Card', highCard: Math.max(...values) };
    }
    
    isStraight(values) {
        // Check for regular straight
        let consecutive = true;
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i + 1] - values[i] !== 1) {
                consecutive = false;
                break;
            }
        }
        
        if (consecutive) {
            return true;
        }
        
        // Check for A-2-3-4-5 straight (wheel)
        if (values.join(',') === '2,3,4,5,14') {
            return true;
        }
        
        return false;
    }
    
    getHighCard(counts, targetCount) {
        for (let value in counts) {
            if (counts[value] === targetCount) {
                return parseInt(value);
            }
        }
        return 0;
    }
    
    compareHands() {
        const playerEval = this.evaluateHand(this.playerHand);
        const computerEval = this.evaluateHand(this.computerHand);
        
        if (playerEval.rank > computerEval.rank) {
            return { winner: 'player', playerHand: playerEval, computerHand: computerEval };
        } else if (playerEval.rank < computerEval.rank) {
            return { winner: 'computer', playerHand: playerEval, computerHand: computerEval };
        } else {
            // Same rank, compare high cards
            if (playerEval.highCard > computerEval.highCard) {
                return { winner: 'player', playerHand: playerEval, computerHand: computerEval };
            } else if (playerEval.highCard < computerEval.highCard) {
                return { winner: 'computer', playerHand: playerEval, computerHand: computerEval };
            } else {
                return { winner: 'tie', playerHand: playerEval, computerHand: computerEval };
            }
        }
    }
    
    updateUI() {
        // Update score display
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('computerScore').textContent = this.computerScore;
        document.getElementById('roundCount').textContent = this.roundCount;
        
        // Update hands display
        this.displayHand(this.playerHand, 'playerHand', true);
        this.displayHand(this.computerHand, 'computerHand', false);
    }
    
    displayHand(hand, containerId, isPlayerHand) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        hand.forEach((card, index) => {
            const cardElement = this.createCardElement(card, isPlayerHand, index);
            container.appendChild(cardElement);
        });
    }
    
    createCardElement(card, isPlayerHand, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.style.width = '80px';
        cardDiv.style.height = '112px';
        cardDiv.style.display = 'inline-block';
        cardDiv.style.margin = '4px';
        cardDiv.style.border = '6px solid #fff';
        cardDiv.style.outline = '3px solid #000';
        cardDiv.style.borderRadius = '0';
        cardDiv.style.boxShadow = 'none';
        cardDiv.style.fontFamily = '"Press Start 2P", monospace, Arial, sans-serif';
        cardDiv.style.fontSize = '18px';
        cardDiv.style.letterSpacing = '0px';
        cardDiv.style.color = (card.suit === '♥' || card.suit === '♦') ? '#ff3c3c' : '#fff';
        cardDiv.style.textShadow = 'none';
        cardDiv.style.imageRendering = 'pixelated';
        cardDiv.style.position = 'relative';
        cardDiv.style.overflow = 'hidden';
        cardDiv.style.boxSizing = 'border-box';
        cardDiv.style.filter = 'contrast(2)';
        cardDiv.style.zIndex = '1';

        // Determine card image filename
        let cardImg = '';
        if (!isPlayerHand && this.gameState !== 'revealed') {
            cardImg = 'BACK.png';
        } else {
            // Map suit and rank to filename, e.g. 'A-S.png', '10-H.png', etc.
            let suitLetter = '';
            switch (card.suit) {
                case '♠': suitLetter = 'S'; break;
                case '♥': suitLetter = 'H'; break;
                case '♦': suitLetter = 'D'; break;
                case '♣': suitLetter = 'C'; break;
            }
            cardImg = `${card.rank}-${suitLetter}.png`;
        }
        cardDiv.style.background = `#222 url('../../assets/cards/${cardImg}') center/contain no-repeat`;
        cardDiv.style.backgroundSize = '80px 112px';

        // Add pixel grid overlay
        const grid = document.createElement('div');
        grid.style.position = 'absolute';
        grid.style.top = '0';
        grid.style.left = '0';
        grid.style.width = '100%';
        grid.style.height = '100%';
        grid.style.pointerEvents = 'none';
        grid.style.backgroundImage =
            'linear-gradient(to right, rgba(0,0,0,0.15) 1px, transparent 1px),'+
            'linear-gradient(to bottom, rgba(0,0,0,0.15) 1px, transparent 1px)';
        grid.style.backgroundSize = '8px 8px';
        cardDiv.appendChild(grid);

        // Add click for selection (player hand, selecting phase)
        if (isPlayerHand && this.gameState === 'selecting') {
            cardDiv.addEventListener('click', () => this.toggleCardSelection(index, cardDiv));
        }
        return cardDiv;
    }
    
    toggleCardSelection(index, cardElement) {
        if (this.selectedCards.includes(index)) {
            this.selectedCards = this.selectedCards.filter(i => i !== index);
            cardElement.classList.remove('selected');
        } else {
            this.selectedCards.push(index);
            cardElement.classList.add('selected');
        }
        
        this.updateMessage();
    }
    
    updateMessage() {
        const messageElement = document.getElementById('gameMessage');
        
        switch (this.gameState) {
            case 'selecting':
                if (this.selectedCards.length === 0) {
                    messageElement.textContent = 'Select cards to replace or click "Replace Cards" to keep all';
                } else {
                    messageElement.textContent = `Selected ${this.selectedCards.length} card(s) to replace`;
                }
                break;
            case 'ready':
                messageElement.textContent = 'Cards replaced! Click "Reveal Hands" to see who wins.';
                break;
            case 'revealed':
                messageElement.textContent = 'Round complete! Click "Next Round" to continue.';
                break;
        }
    }
}

// Global game instance
let game;

// Game functions
function startGame() {
    game = new PokerGame();
    game.gameState = 'selecting';
    
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    // Show appropriate buttons
    document.getElementById('replaceBtn').style.display = 'inline-block';
    document.getElementById('revealBtn').style.display = 'none';
    document.getElementById('nextRoundBtn').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    
    // Clear hand names
    document.getElementById('playerHandName').textContent = '';
    document.getElementById('computerHandName').textContent = '';
    
    game.updateMessage();
}

function replaceCards() {
    if (game.gameState !== 'selecting') return;
    
    // Replace player's selected cards
    game.replacePlayerCards(game.selectedCards);
    
    // Computer replaces cards
    game.computerReplaceCards();
    
    // Clear selections
    game.selectedCards = [];
    
    // Update game state
    game.gameState = 'ready';
    
    // Update UI
    game.updateUI();
    
    // Show appropriate buttons
    document.getElementById('replaceBtn').style.display = 'none';
    document.getElementById('revealBtn').style.display = 'inline-block';
    document.getElementById('nextRoundBtn').style.display = 'none';
    
    game.updateMessage();
}

function revealHands() {
    if (game.gameState !== 'ready') return;
    
    game.gameState = 'revealed';
    
    // Evaluate hands and determine winner
    const result = game.compareHands();
    
    // Update scores
    if (result.winner === 'player') {
        game.playerScore++;
        createFireworks();
    } else if (result.winner === 'computer') {
        game.computerScore++;
    }
    
    // Display hand names
    document.getElementById('playerHandName').textContent = result.playerHand.name;
    document.getElementById('computerHandName').textContent = result.computerHand.name;
    
    // Show result
    const resultDiv = document.getElementById('result');
    let winnerText = '';
    let winnerClass = '';
    
    if (result.winner === 'player') {
        winnerText = '🎉 You Win! 🎉';
        winnerClass = 'player-win';
    } else if (result.winner === 'computer') {
        winnerText = '🤖 Computer Wins';
        winnerClass = 'computer-win';
    } else {
        winnerText = '🤝 It\'s a Tie!';
        winnerClass = 'tie';
    }
    
    resultDiv.innerHTML = `
        <div class="winner ${winnerClass}">${winnerText}</div>
        <div><strong>Your Hand:</strong> ${result.playerHand.name}</div>
        <div><strong>Computer Hand:</strong> ${result.computerHand.name}</div>
    `;
    resultDiv.style.display = 'block';
    
    // Update UI
    game.updateUI();
    
    // Show appropriate buttons
    document.getElementById('replaceBtn').style.display = 'none';
    document.getElementById('revealBtn').style.display = 'none';
    document.getElementById('nextRoundBtn').style.display = 'inline-block';
    
    game.updateMessage();
}

function nextRound() {
    game.roundCount++;
    game.createDeck();
    game.shuffleDeck();
    game.dealInitialHands();
    game.selectedCards = [];
    game.gameState = 'selecting';
    
    // Hide result and clear hand names
    document.getElementById('result').style.display = 'none';
    document.getElementById('playerHandName').textContent = '';
    document.getElementById('computerHandName').textContent = '';
    
    // Show appropriate buttons
    document.getElementById('replaceBtn').style.display = 'inline-block';
    document.getElementById('revealBtn').style.display = 'none';
    document.getElementById('nextRoundBtn').style.display = 'none';
    
    // Update UI
    game.updateUI();
    game.updateMessage();
}

function showStartScreen() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}

function createFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa726', '#26de81', '#fd79a8', '#fdcb6e'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            fireworksContainer.appendChild(firework);
            
            setTimeout(() => {
                if (fireworksContainer.contains(firework)) {
                    fireworksContainer.removeChild(firework);
                }
            }, 1000);
        }, i * 150);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Game will start when user clicks "Start Game" button
    console.log('4th of July Poker Game Loaded!');
});
