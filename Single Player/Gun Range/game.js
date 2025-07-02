class GunRangeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.crosshair = document.getElementById('crosshair');
        
        // Game state
        this.gameState = 'start'; // 'start', 'playing', 'gameOver'
        this.score = 0;
        this.ammo = 30;
        this.timeLeft = 60;
        this.targets = [];
        this.particles = [];
        this.bulletHoles = [];
        
        // Shooting zone position (controlled by arrow keys)
        this.shootingZone = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        
        // Arrow key states
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // Game settings
        this.targetSpawnRate = 0.02;
        this.maxTargets = 5;
        this.targetSpeed = 2;
        
        // Gun state management
        this.gunState = 'unfired'; // 'unfired', 'fired', 'reload'
        this.gunStateTimer = 0;
        
        // Resize canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Event listeners
        this.setupEventListeners();
        
        // Game loop
        this.gameLoop();
        
        // Create placeholder images
        this.createPlaceholderImages();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createPlaceholderImages() {
        // Create target image - try to load target.png first, then SVG fallback
        this.targetImage = new Image();
        this.targetImage.onload = () => {
            console.log('Target image loaded successfully from assets');
        };
        this.targetImage.onerror = () => {
            console.log('target.png not found, trying SVG fallback');
            // Try SVG fallback
            this.targetImage.onerror = () => {
                console.log('target.svg not found, creating canvas placeholder');
                this.createPlaceholderTarget();
            };
            this.targetImage.src = '../../assets/target.svg';
        };
        // Try to load PNG first
        this.targetImage.src = '../../assets/target.png';
        
        // Create bullet hole image - try to load shotBullet.png first, then SVG fallback
        this.bulletHoleImage = new Image();
        this.bulletHoleImage.onload = () => {
            console.log('Shot bullet image loaded successfully from assets');
        };
        this.bulletHoleImage.onerror = () => {
            console.log('shotBullet.png not found, trying SVG fallback');
            // Try SVG fallback
            this.bulletHoleImage.onerror = () => {
                console.log('shotBullet.svg not found, creating canvas placeholder');
                this.createPlaceholderBulletHole();
            };
            this.bulletHoleImage.src = '../../assets/shotBullet.svg';
        };
        // Try to load PNG first
        this.bulletHoleImage.src = '../../assets/shotBullet.png';
        
        // Create gun image - use SVG directly
        this.gunImage = new Image();
        this.gunImageFired = new Image();
        this.gunImageReload = new Image();
        
        this.gunImage.onload = () => {
            console.log('Gun unfired SVG loaded successfully');
        };
        this.gunImage.onerror = () => {
            console.log('gunUnfired.svg not found, creating canvas placeholder');
            this.createPlaceholderGun();
        };
        this.gunImage.src = '../../assets/gunUnfired.svg';
        
        this.gunImageFired.onload = () => {
            console.log('Gun fired SVG loaded successfully');
        };
        this.gunImageFired.onerror = () => {
            console.log('gunFired.svg not found');
        };
        this.gunImageFired.src = '../../assets/gunFired.svg';
        
        this.gunImageReload.onload = () => {
            console.log('Gun reload SVG loaded successfully');
        };
        this.gunImageReload.onerror = () => {
            console.log('gunReload.svg not found');
        };
        this.gunImageReload.src = '../../assets/gunReload.svg';
        
        // Create canvas placeholders as final fallback after a delay
        setTimeout(() => {
            if (!this.targetImage.complete || this.targetImage.naturalWidth === 0) {
                this.createPlaceholderTarget();
            }
            if (!this.bulletHoleImage.complete || this.bulletHoleImage.naturalWidth === 0) {
                this.createPlaceholderBulletHole();
            }
            if (!this.gunImage.complete || this.gunImage.naturalWidth === 0) {
                this.createPlaceholderGun();
            }
        }, 500);
    }
    
    getCurrentGunImage() {
        switch(this.gunState) {
            case 'fired':
                return this.gunImageFired.complete ? this.gunImageFired : this.gunImage;
            case 'reload':
                return this.gunImageReload.complete ? this.gunImageReload : this.gunImage;
            case 'unfired':
            default:
                return this.gunImage;
        }
    }
    
    createPlaceholderTarget() {
        // Create a higher quality target placeholder
        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = 120;
        targetCanvas.height = 120;
        const targetCtx = targetCanvas.getContext('2d');
        
        // Draw concentric circles for target
        const centerX = 60;
        const centerY = 60;
        
        // White background circle
        targetCtx.fillStyle = '#ffffff';
        targetCtx.beginPath();
        targetCtx.arc(centerX, centerY, 58, 0, Math.PI * 2);
        targetCtx.fill();
        
        // Black border
        targetCtx.strokeStyle = '#000000';
        targetCtx.lineWidth = 4;
        targetCtx.beginPath();
        targetCtx.arc(centerX, centerY, 58, 0, Math.PI * 2);
        targetCtx.stroke();
        
        // Outer ring (black)
        targetCtx.fillStyle = '#000000';
        targetCtx.beginPath();
        targetCtx.arc(centerX, centerY, 50, 0, Math.PI * 2);
        targetCtx.fill();
        
        // Second ring (white)
        targetCtx.fillStyle = '#ffffff';
        targetCtx.beginPath();
        targetCtx.arc(centerX, centerY, 40, 0, Math.PI * 2);
        targetCtx.fill();
        
        // Third ring (black)
        targetCtx.fillStyle = '#000000';
        targetCtx.beginPath();
        targetCtx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        targetCtx.fill();
        
        // Fourth ring (white)
        targetCtx.fillStyle = '#ffffff';
        targetCtx.beginPath();
        targetCtx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        targetCtx.fill();
        
        // Inner ring (black)
        targetCtx.fillStyle = '#000000';
        targetCtx.beginPath();
        targetCtx.arc(centerX, centerY, 12, 0, Math.PI * 2);
        targetCtx.fill();
        
        // Bullseye (red)
        targetCtx.fillStyle = '#ff0000';
        targetCtx.beginPath();
        targetCtx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        targetCtx.fill();
        
        // Only set if the actual image failed to load
        if (!this.targetImage.complete || this.targetImage.naturalWidth === 0) {
            this.targetImage.src = targetCanvas.toDataURL();
            console.log('Using placeholder target image');
        }
    }
    
    createPlaceholderBulletHole() {
        // Create a more realistic bullet hole placeholder
        const bulletCanvas = document.createElement('canvas');
        bulletCanvas.width = 24;
        bulletCanvas.height = 24;
        const bulletCtx = bulletCanvas.getContext('2d');
        
        // Create gradient for depth effect
        const gradient = bulletCtx.createRadialGradient(12, 12, 0, 12, 12, 12);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.5, '#333333');
        gradient.addColorStop(0.8, '#666666');
        gradient.addColorStop(1, '#999999');
        
        // Draw bullet hole with gradient
        bulletCtx.fillStyle = gradient;
        bulletCtx.beginPath();
        bulletCtx.arc(12, 12, 10, 0, Math.PI * 2);
        bulletCtx.fill();
        
        // Inner dark hole
        bulletCtx.fillStyle = '#000000';
        bulletCtx.beginPath();
        bulletCtx.arc(12, 12, 4, 0, Math.PI * 2);
        bulletCtx.fill();
        
        // Add some scattered debris effect
        bulletCtx.fillStyle = '#444444';
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 12 + Math.random() * 3;
            const x = 12 + Math.cos(angle) * distance;
            const y = 12 + Math.sin(angle) * distance;
            bulletCtx.beginPath();
            bulletCtx.arc(x, y, 1, 0, Math.PI * 2);
            bulletCtx.fill();
        }
        
        // Only set if the actual image failed to load
        if (!this.bulletHoleImage.complete || this.bulletHoleImage.naturalWidth === 0) {
            this.bulletHoleImage.src = bulletCanvas.toDataURL();
            console.log('Using placeholder bullet hole image');
        }
    }
    
    createPlaceholderGun() {
        // Create pixelated gun placeholder (64x64 to match SVG)
        const gunCanvas = document.createElement('canvas');
        gunCanvas.width = 64;
        gunCanvas.height = 64;
        const gunCtx = gunCanvas.getContext('2d');
        
        // Draw pixelated gun from backside view
        gunCtx.fillStyle = '#505050';
        // Barrel
        gunCtx.fillRect(28, 8, 8, 24);
        gunCtx.fillStyle = '#404040';
        // Muzzle
        gunCtx.fillRect(26, 6, 12, 4);
        gunCtx.fillRect(28, 4, 8, 4);
        gunCtx.fillRect(30, 2, 4, 4);
        
        // Gun body
        gunCtx.fillStyle = '#606060';
        gunCtx.fillRect(20, 32, 24, 16);
        gunCtx.fillRect(22, 36, 20, 8);
        
        // Trigger guard
        gunCtx.fillStyle = '#404040';
        gunCtx.fillRect(24, 48, 16, 8);
        
        // Grip
        gunCtx.fillStyle = '#505050';
        gunCtx.fillRect(32, 56, 8, 8);
        
        // Only set if the actual image failed to load
        if (!this.gunImage.complete || this.gunImage.naturalWidth === 0) {
            this.gunImage.src = gunCanvas.toDataURL();
            console.log('Using placeholder gun image');
        }
    }

    setupEventListeners() {
        // Mouse click for shooting
        document.addEventListener('click', (e) => {
            if (this.gameState === 'playing') {
                // Shoot from the current shooting zone position
                this.shoot(this.shootingZone.x, this.shootingZone.y);
            }
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                switch(e.key) {
                    case 'r':
                    case 'R':
                        this.reload();
                        break;
                    case ' ': // Spacebar for shooting
                        this.shoot(this.shootingZone.x, this.shootingZone.y);
                        e.preventDefault();
                        break;
                    case 'ArrowUp':
                        this.keys.up = true;
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        this.keys.down = true;
                        e.preventDefault();
                        break;
                    case 'ArrowLeft':
                        this.keys.left = true;
                        e.preventDefault();
                        break;
                    case 'ArrowRight':
                        this.keys.right = true;
                        e.preventDefault();
                        break;
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.keys.up = false;
                    break;
                case 'ArrowDown':
                    this.keys.down = false;
                    break;
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
            }
        });
        
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Prevent context menu
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.ammo = 30;
        this.timeLeft = 60;
        this.targets = [];
        this.particles = [];
        this.bulletHoles = [];
        
        // Reset shooting zone to center
        this.shootingZone = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        // Start timer
        this.timer = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        this.updateUI();
    }
    
    endGame() {
        this.gameState = 'gameOver';
        clearInterval(this.timer);
        
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    reload() {
        if (this.ammo < 30) {
            // Set gun to reload state
            this.gunState = 'reload';
            this.gunStateTimer = 60; // Show reload animation for 1 second (60 frames)
            
            this.ammo = 30;
            this.updateUI();
            
            // Show reload message
            this.showReloadMessage();
        }
    }
    
    showReloadMessage() {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = 'RELOADED!';
        popup.style.left = (this.canvas.width / 2) + 'px';
        popup.style.top = (this.canvas.height / 2 + 50) + 'px';
        popup.style.color = '#00ff00';
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 1000);
    }
    
    shoot(x, y) {
        if (this.ammo <= 0) return;
        
        this.ammo--;
        
        // Set gun to fired state for recoil effect
        this.gunState = 'fired';
        this.gunStateTimer = 10; // Show fired animation for ~0.17 seconds (10 frames)
        
        // Check for target hits
        let hit = false;
        for (let i = this.targets.length - 1; i >= 0; i--) {
            const target = this.targets[i];
            const distance = Math.sqrt(
                Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2)
            );
            
            if (distance <= target.size / 2) {
                // Calculate score based on distance from center
                const maxDistance = target.size / 2;
                const accuracy = 1 - (distance / maxDistance);
                let points = Math.floor(accuracy * 10);
                if (points < 1) points = 1;
                
                this.score += points;
                hit = true;
                
                // Show score popup at target location
                this.showScorePopup(target.x, target.y, points);
                
                // Create hit particles
                this.createHitParticles(target.x, target.y);
                
                // Remove target
                this.targets.splice(i, 1);
                break;
            }
        }
        
        // Create muzzle flash effect
        this.createMuzzleFlash();
        
        // Create bullet hole at shooting position
        this.createBulletHole(x, y);
        
        // Gun sound effect (visual feedback)
        if (!hit) {
            this.createMissParticles(x, y);
        }
        
        this.updateUI();
        
        if (this.ammo <= 0 && this.targets.length === 0) {
            setTimeout(() => this.endGame(), 1000);
        }
    }
    
    showScorePopup(x, y, points) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${points}`;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 1000);
    }
    
    createBulletHole(x, y) {
        this.bulletHoles.push({
            x: x,
            y: y,
            life: 300 // Bullet holes last longer
        });
    }
    
    createHitParticles(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                color: `hsl(${Math.random() * 60}, 100%, 50%)`
            });
        }
    }
    
    createMissParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 20,
                color: '#888888'
            });
        }
    }
    
    createMuzzleFlash() {
        // Add visual muzzle flash effect at bottom center
        const x = this.canvas.width / 2;
        const y = this.canvas.height - 50;
        
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 1) * 10,
                life: 15,
                color: `hsl(${30 + Math.random() * 30}, 100%, ${50 + Math.random() * 50}%)`
            });
        }
    }
    
    spawnTarget() {
        if (this.targets.length < this.maxTargets && Math.random() < this.targetSpawnRate) {
            // Always spawn from right side, moving left
            let x, y, vx, vy;
            
            x = this.canvas.width + 100; // Start from right side
            y = Math.random() * (this.canvas.height - 300) + 150; // Keep away from edges
            vx = -(Math.random() * this.targetSpeed + 2); // Always move left (negative velocity)
            vy = 0; // No vertical movement
            
            this.targets.push({
                x: x,
                y: y,
                vx: vx,
                vy: vy,
                size: 100 + Math.random() * 60, // Bigger targets (100-160 instead of 60-100)
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            });
        }
    }
    
    updateTargets() {
        for (let i = this.targets.length - 1; i >= 0; i--) {
            const target = this.targets[i];
            
            target.x += target.vx;
            target.y += target.vy;
            target.rotation += target.rotationSpeed;
            
            // Remove targets that are off screen
            if (target.x < -100 || target.x > this.canvas.width + 100 ||
                target.y < -100 || target.y > this.canvas.height + 100) {
                this.targets.splice(i, 1);
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateBulletHoles() {
        for (let i = this.bulletHoles.length - 1; i >= 0; i--) {
            const hole = this.bulletHoles[i];
            hole.life--;
            
            if (hole.life <= 0) {
                this.bulletHoles.splice(i, 1);
            }
        }
    }
    
    updateShootingZone() {
        const speed = 3;
        
        if (this.keys.up && this.shootingZone.y > 50) {
            this.shootingZone.y -= speed;
        }
        if (this.keys.down && this.shootingZone.y < this.canvas.height - 50) {
            this.shootingZone.y += speed;
        }
        if (this.keys.left && this.shootingZone.x > 50) {
            this.shootingZone.x -= speed;
        }
        if (this.keys.right && this.shootingZone.x < this.canvas.width - 50) {
            this.shootingZone.x += speed;
        }
    }
    
    updateGunState() {
        if (this.gunStateTimer > 0) {
            this.gunStateTimer--;
            
            // Reset to unfired state when timer expires
            if (this.gunStateTimer === 0) {
                if (this.gunState === 'fired' || this.gunState === 'reload') {
                    this.gunState = 'unfired';
                }
            }
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState !== 'playing') return;
        
        // Draw bullet holes first (behind everything)
        this.bulletHoles.forEach(hole => {
            this.ctx.globalAlpha = hole.life / 300;
            this.ctx.drawImage(
                this.bulletHoleImage,
                hole.x - 12,
                hole.y - 12,
                24,
                24
            );
            this.ctx.globalAlpha = 1;
        });
        
        // Draw targets
        this.targets.forEach(target => {
            this.ctx.save();
            this.ctx.translate(target.x, target.y);
            this.ctx.rotate(target.rotation);
            this.ctx.drawImage(
                this.targetImage,
                -target.size / 2,
                -target.size / 2,
                target.size,
                target.size
            );
            this.ctx.restore();
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
            this.ctx.globalAlpha = 1;
        });
        
        // Draw gun at bottom center (64x64 SVG) - use current gun state
        const currentGunImage = this.getCurrentGunImage();
        if (currentGunImage.complete) {
            const gunSize = 240; // Scale up the 64x64 SVG
            const gunX = this.canvas.width / 2 - gunSize / 2;
            const gunY = this.canvas.height - gunSize - 20;
            this.ctx.drawImage(currentGunImage, gunX, gunY, gunSize, gunSize);
        }
        
        // Draw shooting zone crosshair
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.shootingZone.x, this.shootingZone.y, 20, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Draw crosshair lines
        this.ctx.beginPath();
        this.ctx.moveTo(this.shootingZone.x - 15, this.shootingZone.y);
        this.ctx.lineTo(this.shootingZone.x + 15, this.shootingZone.y);
        this.ctx.moveTo(this.shootingZone.x, this.shootingZone.y - 15);
        this.ctx.lineTo(this.shootingZone.x, this.shootingZone.y + 15);
        this.ctx.stroke();
    }
    
    updateUI() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('ammo').textContent = `Ammo: ${this.ammo}`;
        document.getElementById('timer').textContent = `Time: ${this.timeLeft}s`;
    }
    
    gameLoop() {
        if (this.gameState === 'playing') {
            this.spawnTarget();
            this.updateTargets();
            this.updateParticles();
            this.updateBulletHoles();
            this.updateShootingZone();
            this.updateGunState();
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new GunRangeGame();
});
