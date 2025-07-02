// Freedom Games Home Page JavaScript

// Game data
const games = {
    singlePlayer: [
        {
            title: "Flappy Eagle",
            description: "Guide the patriotic eagle through obstacles in this Flappy Bird-style game",
            path: "Single Player/Flappy Eagle/index.html"
        },
        {
            title: "Gun Range",
            description: "Test your shooting skills in this 4th of July themed target practice game",
            path: "Single Player/Gun Range/index.html"
        },
        {
            title: "Poker",
            description: "Play 5-card draw poker against the computer in patriotic style",
            path: "Single Player/Poker/index.html"
        }
    ],
    multiplayer: [
        {
            title: "Coming Soon",
            description: "Multiplayer games are currently in development. Check back soon!",
            path: "#"
        }
    ]
};

// Sound effects (using Web Audio API for retro sounds)
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.init();
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }
    
    playButtonClick() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    playMenuOpen() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
}

const soundManager = new SoundManager();

// Animation effects
function createParticleExplosion(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffffff', '#ffa726'];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const angle = (i / particleCount) * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(particle);
            }
        };
        
        setTimeout(() => animate(), i * 10);
    }
}

// Menu functions
function showSinglePlayerGames() {
    soundManager.playMenuOpen();
    const overlay = document.getElementById('gameOverlay');
    const title = document.getElementById('overlayTitle');
    const grid = document.getElementById('gamesGrid');
    
    title.textContent = 'Single Player Games';
    grid.innerHTML = '';
    
    games.singlePlayer.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <h3>${game.title}</h3>
            <p>${game.description}</p>
        `;
        
        gameCard.addEventListener('click', (e) => {
            soundManager.playButtonClick();
            const rect = gameCard.getBoundingClientRect();
            createParticleExplosion(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
            
            setTimeout(() => {
                if (game.path !== '#') {
                    window.location.href = game.path;
                }
            }, 300);
        });
        
        grid.appendChild(gameCard);
    });
    
    overlay.classList.remove('hidden');
}

function showMultiplayerGames() {
    soundManager.playMenuOpen();
    const overlay = document.getElementById('gameOverlay');
    const title = document.getElementById('overlayTitle');
    const grid = document.getElementById('gamesGrid');
    
    title.textContent = 'Multiplayer Games';
    grid.innerHTML = '';
    
    games.multiplayer.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <h3>${game.title}</h3>
            <p>${game.description}</p>
        `;
        
        if (game.path !== '#') {
            gameCard.addEventListener('click', (e) => {
                soundManager.playButtonClick();
                const rect = gameCard.getBoundingClientRect();
                createParticleExplosion(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2
                );
                
                setTimeout(() => {
                    window.location.href = game.path;
                }, 300);
            });
        } else {
            gameCard.style.opacity = '0.7';
            gameCard.style.cursor = 'not-allowed';
        }
        
        grid.appendChild(gameCard);
    });
    
    overlay.classList.remove('hidden');
}

function showSettings() {
    soundManager.playMenuOpen();
    const overlay = document.getElementById('gameOverlay');
    const title = document.getElementById('overlayTitle');
    const grid = document.getElementById('gamesGrid');
    
    title.textContent = 'Settings';
    grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: #fff; padding: 40px;">
            <h3 style="margin-bottom: 20px; font-size: 1.2rem;">Game Settings</h3>
            <div style="display: flex; flex-direction: column; gap: 20px; align-items: center;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <label style="font-size: 0.8rem;">Sound Effects:</label>
                    <input type="checkbox" id="soundToggle" checked style="transform: scale(1.5);">
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <label style="font-size: 0.8rem;">Fullscreen Mode:</label>
                    <button onclick="toggleFullscreen()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-family: 'Press Start 2P'; font-size: 0.6rem;">TOGGLE</button>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <label style="font-size: 0.8rem;">Reset High Scores:</label>
                    <button onclick="resetScores()" style="padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; font-family: 'Press Start 2P'; font-size: 0.6rem;">RESET</button>
                </div>
            </div>
        </div>
    `;
    
    overlay.classList.remove('hidden');
}

function showAbout() {
    soundManager.playMenuOpen();
    const overlay = document.getElementById('gameOverlay');
    const title = document.getElementById('overlayTitle');
    const grid = document.getElementById('gamesGrid');
    
    title.textContent = 'About Freedom Games';
    grid.innerHTML = `
        <div style="grid-column: 1 / -1; color: #fff; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="font-size: 1.2rem; margin-bottom: 20px; color: #4ecdc4;">🎆 Freedom Games 🎆</h3>
                <p style="font-size: 0.7rem; margin-bottom: 15px;">A collection of patriotic mini-games celebrating the 4th of July!</p>
                <p style="font-size: 0.6rem; opacity: 0.8;">Version 1.0.0</p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h4 style="font-size: 0.8rem; color: #ffa726; margin-bottom: 10px;">Features:</h4>
                <ul style="font-size: 0.6rem; list-style-position: inside; opacity: 0.9;">
                    <li>Minecraft-inspired pixelated graphics</li>
                    <li>Patriotic 4th of July theme</li>
                    <li>Multiple single-player games</li>
                    <li>Responsive design for all devices</li>
                    <li>Retro sound effects</li>
                </ul>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h4 style="font-size: 0.8rem; color: #ffa726; margin-bottom: 10px;">Games Included:</h4>
                <ul style="font-size: 0.6rem; list-style-position: inside; opacity: 0.9;">
                    <li>Flappy Eagle - Patriotic bird flight challenge</li>
                    <li>Gun Range - Target shooting practice</li>
                    <li>Poker - Classic card game vs computer</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 0.6rem; opacity: 0.7;">Made with ❤️ for America's Independence Day</p>
                <p style="font-size: 0.5rem; opacity: 0.6; margin-top: 10px;">Built with HTML5, CSS3, and JavaScript</p>
            </div>
        </div>
    `;
    
    overlay.classList.remove('hidden');
}

function hideOverlay() {
    soundManager.playButtonClick();
    document.getElementById('gameOverlay').classList.add('hidden');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen not supported');
        });
    } else {
        document.exitFullscreen();
    }
}

function resetScores() {
    if (confirm('Are you sure you want to reset all high scores?')) {
        localStorage.clear();
        alert('High scores have been reset!');
    }
}

// Add click sound effects to all buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add sound effects to menu buttons
    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            soundManager.playButtonClick();
        });
    });
    
    // Add particle effects to menu buttons
    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            createParticleExplosion(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideOverlay();
        }
    });
    
    // Initialize sound on first user interaction
    document.addEventListener('click', () => {
        if (soundManager.audioContext && soundManager.audioContext.state === 'suspended') {
            soundManager.audioContext.resume();
        }
    }, { once: true });
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length &&
        konamiCode.every((key, index) => key === konamiSequence[index])) {
        
        // Activate easter egg - extra fireworks
        triggerEasterEgg();
        konamiCode = [];
    }
});

function triggerEasterEgg() {
    const fireworksContainer = document.querySelector('.fireworks-container');
    
    // Create extra fireworks
    for (let i = 0; i < 10; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.setProperty('--delay', Math.random() * 3 + 's');
        firework.style.setProperty('--x', Math.random() * 100 + '%');
        firework.style.setProperty('--y', Math.random() * 100 + '%');
        
        fireworksContainer.appendChild(firework);
        
        // Remove after animation
        setTimeout(() => {
            fireworksContainer.removeChild(firework);
        }, 8000);
    }
    
    // Show easter egg message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: #fff;
        padding: 20px;
        border: 3px solid #ffd700;
        font-family: 'Press Start 2P';
        font-size: 0.8rem;
        text-align: center;
        z-index: 10000;
        animation: pulse 2s ease-in-out infinite;
    `;
    message.innerHTML = '🎆 EASTER EGG ACTIVATED! 🎆<br>Extra Fireworks Unlocked!';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        document.body.removeChild(message);
    }, 3000);
}
