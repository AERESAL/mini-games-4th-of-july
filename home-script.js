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
        },
        {
            title: "Black Jack",
            description: "Play 5-card draw poker against the computer in patriotic style",
            path: "Single Player/blackjack/index.html"
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

// Music Player for Radio
class MusicPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.currentStation = 0;
        this.stations = [
            {
                name: "KQED 88.5 FM - San Francisco NPR",
                url: "https://streams.kqed.org/kqedradio"
            },
            {
                name: "SomaFM - Groove Salad",
                url: "https://ice1.somafm.com/groovesalad-256-mp3"
            },
            {
                name: "SomaFM - Lush",
                url: "https://ice1.somafm.com/lush-128-mp3"
            },
            {
                name: "KCRW 89.9 FM - Santa Monica",
                url: "https://kcrw.streamguys1.com/kcrw_192k_mp3_e24"
            },
            {
                name: "KPFA 94.1 FM - Berkeley",
                url: "https://streams.kpfa.org:8000/kpfa_128"
            }
        ];
        
        // Load saved stations from localStorage
        this.loadStationsFromStorage();
        this.initMusicButton();
    }
    
    initMusicButton() {
        const musicButton = document.getElementById('musicButton');
        if (!musicButton) return;
        
        musicButton.addEventListener('click', () => {
            this.showRadioMenu();
            soundManager.playButtonClick();
        });
        
        // Add right-click to cycle through stations
        musicButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.nextStation();
        });
    }
    
    toggleMusic() {
        if (this.isPlaying) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
    }
    
    startMusic() {
        if (!this.audio) {
            this.audio = new Audio();
            this.audio.crossOrigin = "anonymous";
            this.audio.preload = "none";
            
            this.audio.addEventListener('error', (e) => {
                console.log('Error loading radio station, trying next...');
                this.nextStation();
            });
            
            this.audio.addEventListener('loadstart', () => {
                console.log('Loading radio station...');
            });
            
            this.audio.addEventListener('canplay', () => {
                console.log('Radio station ready to play');
            });
        }
        
        this.audio.src = this.stations[this.currentStation].url;
        this.audio.volume = 0.5;
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateButtonState();
            this.showStationInfo();
        }).catch((error) => {
            console.log('Error playing radio:', error);
            // Try a fallback approach with a simple audio stream
            this.tryFallbackStation();
        });
    }
    
    tryFallbackStation() {
        // Use a reliable SomaFM stream as fallback
        const fallbackUrl = "https://ice1.somafm.com/deepspaceone-128-mp3";
        this.audio.src = fallbackUrl;
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateButtonState();
            this.showStationInfo("SomaFM - Deep Space One");
        }).catch((error) => {
            console.log('Fallback station also failed:', error);
            this.showError();
        });
    }
    
    stopMusic() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        this.isPlaying = false;
        this.updateButtonState();
    }
    
    nextStation() {
        this.currentStation = (this.currentStation + 1) % this.stations.length;
        if (this.isPlaying) {
            this.stopMusic();
            setTimeout(() => this.startMusic(), 100);
        }
    }
    
    updateButtonState() {
        const musicButton = document.getElementById('musicButton');
        const musicIcon = musicButton.querySelector('.music-icon');
        const musicText = musicButton.querySelector('.music-text');
        
        if (this.isPlaying) {
            musicButton.classList.add('playing');
            musicButton.classList.remove('muted');
            musicIcon.textContent = '🎵';
            musicText.textContent = 'ON AIR';
        } else {
            musicButton.classList.remove('playing');
            musicButton.classList.add('muted');
            musicIcon.textContent = '🔇';
            musicText.textContent = 'RADIO';
        }
    }
    
    showStationInfo(stationName = null) {
        const name = stationName || this.stations[this.currentStation].name;
        const info = document.createElement('div');
        info.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            color: #fff;
            padding: 15px 25px;
            border: 2px solid #B22234;
            font-family: 'Press Start 2P';
            font-size: 0.7rem;
            text-align: center;
            z-index: 10000;
            border-radius: 8px;
        `;
        info.innerHTML = `🎵 NOW PLAYING 🎵<br>${name}`;
        
        document.body.appendChild(info);
        
        setTimeout(() => {
            if (document.body.contains(info)) {
                document.body.removeChild(info);
            }
        }, 3000);
    }
    
    showError() {
        const error = document.createElement('div');
        error.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(178, 34, 52, 0.9);
            color: #fff;
            padding: 15px 25px;
            border: 2px solid #fff;
            font-family: 'Press Start 2P';
            font-size: 0.7rem;
            text-align: center;
            z-index: 10000;
            border-radius: 8px;
        `;
        error.innerHTML = '🚫 RADIO UNAVAILABLE 🚫<br>Check your connection';
        
        document.body.appendChild(error);
        
        setTimeout(() => {
            if (document.body.contains(error)) {
                document.body.removeChild(error);
            }
        }, 3000);
    }
    
    showRadioMenu() {
        // Remove existing menu if present
        const existingMenu = document.getElementById('radioMenu');
        if (existingMenu) {
            document.body.removeChild(existingMenu);
            return;
        }
        
        // Get the music button position for reference
        const musicButton = document.getElementById('musicButton');
        const buttonRect = musicButton.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        
        const menu = document.createElement('div');
        menu.id = 'radioMenu';
        menu.style.cssText = `
            position: fixed;
            bottom: 110px;
            right: 20px;
            background: rgba(0,0,0,0.95);
            border: 4px solid #B22234;
            border-radius: 0px;
            padding: 20px;
            font-family: 'Press Start 2P';
            font-size: 0.6rem;
            color: #fff;
            z-index: 10001;
            min-width: 400px;
            max-width: 90vw;
            box-shadow: 0 0 0 2px #fff, 0 0 0 4px #003366;
            image-rendering: pixelated;
            animation: slideUpFadeIn 0.4s ease-out;
            pointer-events: all;
        `;
        
        const currentStation = this.stations[this.currentStation];
        const isPlaying = this.isPlaying;
        
        let menuHTML = `
            <div style="text-align: center; margin-bottom: 15px; color: #4ecdc4; font-size: 0.8rem; text-shadow: 2px 2px 0px #000;">
                📻 8-BIT RADIO PLAYER 📻
            </div>
            
            <!-- Upward arrow indicator -->
            <div style="position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); color: #B22234; font-size: 1rem; text-shadow: 1px 1px 0px #000;">
                ▲
            </div>
            
            <!-- Current Track Display -->
            <div style="background: #000; border: 2px solid #666; padding: 15px; margin-bottom: 15px; text-align: center;">
                <div style="color: #4ecdc4; font-size: 0.5rem; margin-bottom: 8px;">NOW PLAYING:</div>
                <div style="color: #fff; font-size: 0.6rem; margin-bottom: 10px; word-wrap: break-word;">${currentStation.name}</div>
                <div style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;">
                    <button onclick="musicPlayer.toggleMusic(); musicPlayer.updateRadioMenu();" 
                            style="padding: 8px 16px; background: ${isPlaying ? '#e74c3c' : '#2ecc71'}; color: #fff; border: 2px solid #fff; cursor: pointer; font-family: 'Press Start 2P'; font-size: 0.5rem;">
                        ${isPlaying ? '⏸️ PAUSE' : '▶️ PLAY'}
                    </button>
                    <button onclick="musicPlayer.nextStation(); musicPlayer.updateRadioMenu();" 
                            style="padding: 8px 16px; background: #3498db; color: #fff; border: 2px solid #fff; cursor: pointer; font-family: 'Press Start 2P'; font-size: 0.5rem;">
                        ⏭️ NEXT
                    </button>
                </div>
            </div>
            
            <!-- Station List -->
            <div style="margin-bottom: 15px;">
                <div style="color: #ffa726; font-size: 0.6rem; margin-bottom: 10px; text-align: center;">SELECT STATION:</div>
        `;
        
        // Add current stations with 8-bit styling
        this.stations.forEach((station, index) => {
            const isActive = index === this.currentStation;
            const activeStyle = isActive ? 'background: #B22234; border-color: #fff;' : 'background: #333; border-color: #666;';
            const shortcut = index < 9 ? `[${index + 1}] ` : '';
            menuHTML += `
                <div class="station-item" style="padding: 10px; margin: 5px 0; border: 2px solid; cursor: pointer; ${activeStyle} transition: all 0.1s;" 
                     onclick="musicPlayer.selectStation(${index}); musicPlayer.updateRadioMenu();" 
                     onmouseover="if(${index} !== ${this.currentStation}) this.style.background='#555'" 
                     onmouseout="if(${index} !== ${this.currentStation}) this.style.background='#333'">
                    ${isActive ? '🔊 ' : '📡 '}${shortcut}${station.name}
                </div>
            `;
        });
        
        menuHTML += `
            </div>
            
            <!-- Add Custom Station -->
            <div style="border-top: 2px solid #666; padding-top: 15px; margin-top: 15px;">
                <div style="margin-bottom: 10px; color: #ffa726; font-size: 0.6rem; text-align: center;">ADD CUSTOM STATION:</div>
                <input type="text" id="customStationName" placeholder="Station Name" 
                       style="width: 100%; padding: 8px; margin-bottom: 8px; background: #000; color: #fff; border: 2px solid #666; font-family: 'Press Start 2P'; font-size: 0.5rem; box-sizing: border-box;">
                <input type="url" id="customStationUrl" placeholder="https://stream-url.com/radio.mp3" 
                       style="width: 100%; padding: 8px; margin-bottom: 10px; background: #000; color: #fff; border: 2px solid #666; font-family: 'Press Start 2P'; font-size: 0.5rem; box-sizing: border-box;">
                <div style="display: flex; gap: 10px;">
                    <button onclick="musicPlayer.addCustomStation()" 
                            style="flex: 1; padding: 8px; background: #2ecc71; color: #fff; border: 2px solid #fff; cursor: pointer; font-family: 'Press Start 2P'; font-size: 0.5rem;">
                        ➕ ADD
                    </button>
                    <button onclick="musicPlayer.resetStations()" 
                            style="flex: 1; padding: 8px; background: #e74c3c; color: #fff; border: 2px solid #fff; cursor: pointer; font-family: 'Press Start 2P'; font-size: 0.5rem;">
                        🔄 RESET
                    </button>
                </div>
            </div>
            
            <!-- Volume Control -->
            <div style="border-top: 2px solid #666; padding-top: 15px; margin-top: 15px; text-align: center;">
                <div style="color: #ffa726; font-size: 0.6rem; margin-bottom: 10px;">VOLUME:</div>
                <input type="range" id="volumeSlider" min="0" max="100" value="50" 
                       onchange="musicPlayer.setVolume(this.value)"
                       style="width: 80%; height: 8px; background: #333; border: 2px solid #666;">
                <div style="color: #4ecdc4; font-size: 0.5rem; margin-top: 5px;">
                    <span id="volumeDisplay">50</span>%
                </div>
            </div>
            
            <!-- Keyboard Shortcuts Help -->
            <div style="border-top: 2px solid #666; padding-top: 10px; margin-top: 10px; font-size: 0.4rem; color: #888; text-align: center;">
                <div style="margin-bottom: 5px; color: #4ecdc4;">⌨️ KEYBOARD SHORTCUTS:</div>
                <div>1-9: Select station | Space/Enter: Play/Pause | →/N: Next | ←/P: Previous | Esc: Close</div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="musicPlayer.hideRadioMenu()" 
                        style="padding: 10px 20px; background: #666; color: #fff; border: 2px solid #fff; cursor: pointer; font-family: 'Press Start 2P'; font-size: 0.5rem;">
                    ❌ CLOSE
                </button>
            </div>
        `;
        
        menu.innerHTML = menuHTML;
        document.body.appendChild(menu);
        
        // Set volume slider to current volume
        if (this.audio) {
            const volumeSlider = document.getElementById('volumeSlider');
            const volumeDisplay = document.getElementById('volumeDisplay');
            if (volumeSlider && volumeDisplay) {
                const currentVolume = Math.round(this.audio.volume * 100);
                volumeSlider.value = currentVolume;
                volumeDisplay.textContent = currentVolume;
            }
        }
        
        // Close menu when clicking outside
        setTimeout(() => {
            const clickOutsideHandler = (e) => {
                if (!menu.contains(e.target) && !document.getElementById('musicButton').contains(e.target)) {
                    this.hideRadioMenu();
                    document.removeEventListener('click', clickOutsideHandler);
                    document.removeEventListener('keydown', keyHandler);
                }
            };
            
            const keyHandler = (e) => {
                // Handle keyboard shortcuts
                if (e.key >= '1' && e.key <= '9') {
                    const stationIndex = parseInt(e.key) - 1;
                    if (stationIndex < this.stations.length) {
                        this.selectStation(stationIndex);
                        this.updateRadioMenu();
                    }
                } else if (e.key === 'Escape') {
                    this.hideRadioMenu();
                    document.removeEventListener('click', clickOutsideHandler);
                    document.removeEventListener('keydown', keyHandler);
                } else if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.toggleMusic();
                    this.updateRadioMenu();
                } else if (e.key === 'ArrowRight' || e.key === 'n') {
                    this.nextStation();
                    this.updateRadioMenu();
                } else if (e.key === 'ArrowLeft' || e.key === 'p') {
                    this.currentStation = (this.currentStation - 1 + this.stations.length) % this.stations.length;
                    if (this.isPlaying) {
                        this.stopMusic();
                        setTimeout(() => this.startMusic(), 100);
                    }
                    this.updateRadioMenu();
                }
            };
            
            document.addEventListener('click', clickOutsideHandler);
            document.addEventListener('keydown', keyHandler);
        }, 100);
    }
    
    hideRadioMenu() {
        const menu = document.getElementById('radioMenu');
        if (menu) {
            document.body.removeChild(menu);
        }
    }
    
    selectStation(index) {
        this.currentStation = index;
        if (this.isPlaying) {
            this.stopMusic();
            setTimeout(() => this.startMusic(), 100);
        }
    }
    
    updateRadioMenu() {
        // Refresh the menu if it's open
        const existingMenu = document.getElementById('radioMenu');
        if (existingMenu) {
            this.hideRadioMenu();
            setTimeout(() => this.showRadioMenu(), 50);
        }
    }
    
    setVolume(value) {
        if (this.audio) {
            this.audio.volume = value / 100;
        }
        const volumeDisplay = document.getElementById('volumeDisplay');
        if (volumeDisplay) {
            volumeDisplay.textContent = value;
        }
    }
    
    addCustomStation() {
        const nameInput = document.getElementById('customStationName');
        const urlInput = document.getElementById('customStationUrl');
        
        if (nameInput.value.trim() && urlInput.value.trim()) {
            const newStation = {
                name: nameInput.value.trim(),
                url: urlInput.value.trim()
            };
            
            this.stations.push(newStation);
            this.saveStationsToStorage();
            
            // Show success message
            this.showMessage('📻 STATION ADDED! 📻', '#2ecc71');
            
            // Clear inputs
            nameInput.value = '';
            urlInput.value = '';
            
            // Refresh menu
            this.hideRadioMenu();
            setTimeout(() => this.showRadioMenu(), 100);
        } else {
            this.showMessage('❌ PLEASE FILL ALL FIELDS ❌', '#e74c3c');
        }
    }
    
    resetStations() {
        if (confirm('Reset to default stations? This will remove all custom stations.')) {
            this.stations = [
                {
                    name: "KQED 88.5 FM - San Francisco NPR",
                    url: "https://streams.kqed.org/kqedradio"
                },
                {
                    name: "SomaFM - Groove Salad",
                    url: "https://ice1.somafm.com/groovesalad-256-mp3"
                },
                {
                    name: "SomaFM - Lush",
                    url: "https://ice1.somafm.com/lush-128-mp3"
                },
                {
                    name: "KCRW 89.9 FM - Santa Monica",
                    url: "https://kcrw.streamguys1.com/kcrw_192k_mp3_e24"
                },
                {
                    name: "KPFA 94.1 FM - Berkeley",
                    url: "https://streams.kpfa.org:8000/kpfa_128"
                }
            ];
            
            this.currentStation = 0;
            this.saveStationsToStorage();
            this.showMessage('🔄 STATIONS RESET 🔄', '#3498db');
            
            // Refresh menu
            this.hideRadioMenu();
            setTimeout(() => this.showRadioMenu(), 100);
        }
    }
    
    saveStationsToStorage() {
        localStorage.setItem('radioStations', JSON.stringify(this.stations));
    }
    
    loadStationsFromStorage() {
        const saved = localStorage.getItem('radioStations');
        if (saved) {
            try {
                this.stations = JSON.parse(saved);
            } catch (e) {
                console.log('Error loading saved stations');
            }
        }
    }
    
    showMessage(message, color = '#4ecdc4') {
        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            color: #fff;
            padding: 15px 25px;
            border: 2px solid ${color};
            font-family: 'Press Start 2P';
            font-size: 0.6rem;
            text-align: center;
            z-index: 10002;
            border-radius: 8px;
        `;
        msg.innerHTML = message;
        
        document.body.appendChild(msg);
        
        setTimeout(() => {
            if (document.body.contains(msg)) {
                document.body.removeChild(msg);
            }
        }, 2000);
    }
}

// Initialize music player when page loads
let musicPlayer;

// Add to the existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize music player
    musicPlayer = new MusicPlayer();
});
