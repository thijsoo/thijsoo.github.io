// GameManager.js - Handles game state, initialization, and main game loop

class GameManager {
    constructor() {
        this.app = null;
        this.gameState = GAME_STATES.START;

        // Game state
        this.score = 0;
        this.lives = 3;

        // Game objects
        this.gameObjects = [];
        this.paddle = null;
        this.balls = []; // Changed from single ball to array of balls
        this.brickManager = null;
        this.startScreen = null;
        this.powerUps = []; // Array to track falling power-ups

        // UI and External Systems
        this.uiManager = null;
        this.highscoreManager = null;
        this.soundManager = null;
        this.particleManager = null;

        // Responsive scaling
        this.scaleFactor = 1;
        this.baseWidth = GAME_WIDTH;
        this.baseHeight = GAME_HEIGHT;

        // Input manager
        this.inputManager = new InputManager();

        this.init();
    }

    init() {
        this.createApplication();
        this.setupResponsiveScaling();
        this.setupGameLoop();
        this.setupUI();
        this.setupExternalSystems();
        this.setupPolishSystems();
        this.setupInputHandlers();

        console.log('Yoast SEO Brick Breaker initialized with polish!');
        console.log(`Game dimensions: ${GAME_WIDTH}x${GAME_HEIGHT}`);
        console.log(`PixiJS version: ${PIXI.VERSION}`);
    }

    createApplication() {
        this.app = new PIXI.Application({
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            backgroundColor: COLORS.BLACK,
            antialias: true
        });

        const gameContainer = document.getElementById('gameContainer');
        gameContainer.appendChild(this.app.view);
    }

    setupGameLoop() {
        this.app.ticker.add(this.gameLoop.bind(this));
    }

    setupUI() {
        this.setupStartScreen();

        // Initialize UI Manager
        this.uiManager = new UIManager(GAME_WIDTH, GAME_HEIGHT);
    }

    setupExternalSystems() {
        // Initialize Highscore Manager
        this.highscoreManager = new HighscoreManager();

        // Configure for development (can be changed for production)
        this.highscoreManager.enableDemoMode(true);
        this.highscoreManager.setPlayerName('Yoast Player');
    }

    setupPolishSystems() {
        // Initialize Sound Manager
        this.soundManager = new SoundManager();

        // Initialize Particle Manager
        this.particleManager = new ParticleManager(this.app);

        // Initialize Cheat Manager (development only)
        this.cheatManager = new CheatManager(this);

        console.log('Polish systems initialized (Sound & Particles)');
    }

    setupResponsiveScaling() {
        this.calculateScaling();
        window.addEventListener('resize', () => {
            this.calculateScaling();
        });
    }

    calculateScaling() {
        const container = document.getElementById('gameContainer');
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Calculate scale factor based on available space
        const scaleX = (windowWidth * 0.9) / this.baseWidth;
        const scaleY = (windowHeight * 0.9) / this.baseHeight;
        this.scaleFactor = Math.min(scaleX, scaleY, 1.2); // Max 1.2x scale

        // Apply scaling to the container
        if (container && this.app && this.app.view) {
            const newWidth = this.baseWidth * this.scaleFactor;
            const newHeight = this.baseHeight * this.scaleFactor;

            this.app.view.style.width = `${newWidth}px`;
            this.app.view.style.height = `${newHeight}px`;

            console.log(`Responsive scaling applied: ${this.scaleFactor.toFixed(2)}x`);
        }
    }

    setupStartScreen() {
        this.startScreen = new PIXI.Container();

        // Create title elements
        const title = this.createText('Yoast SEO', {
            fontSize: 48,
            fill: COLORS.GREEN,
            fontWeight: 'bold'
        });
        title.anchor.set(0.5);
        title.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100);

        const subtitle = this.createText('BRICK BREAKER', {
            fontSize: 32,
            fill: COLORS.PURPLE,
            fontWeight: 'bold'
        });
        subtitle.anchor.set(0.5);
        subtitle.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);

        const instructions = this.createText(
            'Use ARROW KEYS or A/D to move paddle\nPress SPACEBAR to launch ball and start game',
            {
                fontSize: 18,
                fill: COLORS.WHITE,
                align: 'center'
            }
        );
        instructions.anchor.set(0.5);
        instructions.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);

        this.startScreen.addChild(title, subtitle, instructions);
        this.app.stage.addChild(this.startScreen);
    }

    createText(content, style) {
        const defaultStyle = {
            fontFamily: 'Arial, sans-serif',
            align: 'center'
        };
        const textStyle = new PIXI.TextStyle({ ...defaultStyle, ...style });
        return new PIXI.Text(content, textStyle);
    }

    setupInputHandlers() {
        this.inputManager.onSpacePressed = () => {
            this.handleSpacePressed();
        };
    }

    handleSpacePressed() {
        switch (this.gameState) {
            case GAME_STATES.START:
                this.startGame();
                break;
            case GAME_STATES.PLAYING:
                if (this.balls.length > 0 && !this.balls[0].isLaunched) {
                    this.balls[0].launch();
                }
                break;
            case GAME_STATES.GAME_OVER:
                this.resetGame();
                break;
        }
    }

    gameLoop(delta) {
        switch (this.gameState) {
            case GAME_STATES.START:
                this.updateStartScreen(delta);
                break;
            case GAME_STATES.PLAYING:
                this.updateGameplay(delta);
                break;
            case GAME_STATES.GAME_OVER:
                this.updateGameOver(delta);
                break;
        }
    }

    updateStartScreen(delta) {
        // Future: Add animations, pulsing text, etc.
    }

    updateGameplay(delta) {
        this.updateGameObjects(delta);
        this.updatePolishSystems(delta);
        this.updateUIAnimations(delta);
        this.handleCollisions();
        this.checkGameConditions();
    }

    updateUIAnimations(delta) {
        // Update UI animations
        if (this.uiManager) {
            this.uiManager.updateAnimations(delta);
        }
    }

    updatePolishSystems(delta) {
        // Update particle effects
        if (this.particleManager) {
            this.particleManager.update(delta);
        }

        // Add ball trail effect
        if (this.balls.length > 0 && this.balls[0].isLaunched && Math.random() < 0.3) {
            this.particleManager.createBallTrail(this.balls[0].position.x, this.balls[0].position.y);
        }
    }

    updateGameObjects(delta) {
        // Update all game objects
        this.gameObjects.forEach(obj => {
            if (obj.isActive) {
                if (obj instanceof Paddle) {
                    obj.update(delta, this.inputManager);
                } else {
                    obj.update(delta);
                }
            }
        });

        // Update power-ups
        this.updatePowerUps(delta);

        // Special handling for ball positioning on paddle
        if (this.balls.length > 0 && !this.balls[0].isLaunched && this.paddle) {
            this.balls[0].positionOnPaddle(this.paddle);
        }
    }

    updatePowerUps(delta) {
        // Update all falling power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.update(delta);

            // Special handling for bombs
            if (powerUp.type === 'bomb') {
                // Check if bomb hits paddle (for bounce)
                if (!powerUp.hasBouncedOffPaddle && this.paddle && powerUp.checkPaddleCollision(this.paddle)) {
                    powerUp.bounceOffPaddle(this.paddle);
                    this.soundManager.playPaddleHit(); // Bounce sound
                    this.particleManager.createPaddleHitGlow(powerUp.position.x, powerUp.position.y);
                }
                // Check if bomb is exploding
                else if (powerUp.isExploding && powerUp.explosionTimer === 0) {
                    // Just started exploding - trigger explosion effects
                    this.handleBombExplosion(powerUp);
                }
            } else {
                // Regular power-up collision handling
                if (this.paddle && powerUp.checkPaddleCollision(this.paddle)) {
                    this.collectPowerUp(powerUp);
                    this.removePowerUp(i);
                    continue;
                }
            }

            // Remove if inactive (fell off screen or finished exploding)
            if (!powerUp.isActive) {
                this.removePowerUp(i);
            }
        }
    }

    handleBombExplosion(bomb) {
        const explosionX = bomb.position.x;
        const explosionY = bomb.position.y;
        const explosionRadius = bomb.getExplosionRadius();

        console.log(`Bomb exploding at (${explosionX}, ${explosionY}) with radius ${explosionRadius}`);

        // Play explosion sound effect
        this.soundManager.playBrickHit(); // Use brick hit sound for now - could be enhanced with explosion sound

        // Create explosion particle effects
        this.particleManager.createBrickHitParticles(explosionX, explosionY, COLORS.ORANGE);
        this.particleManager.createBrickHitParticles(explosionX, explosionY, COLORS.YELLOW);

        // Destroy bricks within explosion radius and get count
        let destroyedCount = 0;
        if (this.brickManager) {
            destroyedCount = this.destroyBricksInExplosion(explosionX, explosionY, explosionRadius);
        }

        // Spawn powerup based on explosion impact
        this.spawnExplosionPowerUp(explosionX, explosionY, destroyedCount);
    }

    destroyBricksInExplosion(centerX, centerY, radius) {
        const activeBricks = this.brickManager.getAllActiveBricks();
        let destroyedCount = 0;

        activeBricks.forEach(brick => {
            // Calculate distance from brick center to explosion center
            const brickCenterX = brick.position.x + brick.width / 2;
            const brickCenterY = brick.position.y + brick.height / 2;

            const distance = Math.sqrt(
                Math.pow(brickCenterX - centerX, 2) +
                Math.pow(brickCenterY - centerY, 2)
            );

            // If brick is within explosion radius, destroy it
            if (distance <= radius && brick.isActive) {
                // Add points for destroyed brick
                this.addScore(brick.points);

                // Remove brick from stage and mark as inactive
                brick.removeFromStage(brick.graphics.parent);
                brick.destroy();
                brick.isActive = false;

                // Update brick manager's active count
                this.brickManager.activeBricks--;
                destroyedCount++;

                // Create particle effects for each destroyed brick
                this.particleManager.createBrickHitParticles(
                    brickCenterX,
                    brickCenterY,
                    COLORS.ORANGE
                );

                console.log(`Bomb destroyed brick at distance ${distance.toFixed(1)}`);
            }
        });

        console.log(`Bomb explosion destroyed ${destroyedCount} bricks`);

        // Check if all bricks are destroyed after the explosion
        if (this.brickManager.areAllBricksDestroyed()) {
            this.handleLevelComplete();
        }

        return destroyedCount; // Return the count of destroyed bricks
    }

    collectPowerUp(powerUp) {
        powerUp.collect();

        // Apply power-up effect based on type
        switch (powerUp.type) {
            case 'paddleWidth':
                if (this.paddle) {
                    this.paddle.increaseWidth();
                    this.particleManager.createPaddleHitGlow(powerUp.position.x, powerUp.position.y);
                    this.soundManager.playPaddleHit(); // Play satisfying collection sound
                }
                break;
        }

        console.log(`Power-up collected: ${powerUp.type}`);
    }

    removePowerUp(index) {
        const powerUp = this.powerUps[index];
        powerUp.removeFromStage(this.app.stage);
        powerUp.destroy();
        this.powerUps.splice(index, 1);
    }

    spawnPowerUp(x, y, type) {
        let powerUp;

        // Use factory pattern to create appropriate power-up type
        switch (type) {
            case 'paddleWidth':
                powerUp = new PowerUp(x, y, type);
                break;
            case 'bomb':
                powerUp = new Bomb(x, y);
                break;
            default:
                console.warn(`Unknown power-up type: ${type}`);
                return;
        }

        powerUp.addToStage(this.app.stage);
        this.powerUps.push(powerUp);
        console.log(`Power-up spawned: ${type} at (${x}, ${y})`);
    }

    handleCollisions() {
        if (this.balls.length === 0) return;

        // Check collisions for all active balls
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            if (!ball.isLaunched) continue;

            // Check paddle collision
            if (this.paddle && ball.checkPaddleCollision(this.paddle)) {
                // Play sound, create glow effect, and trigger paddle glow
                this.soundManager.playPaddleHit();
                this.particleManager.createPaddleHitGlow(ball.position.x, ball.position.y);
                this.paddle.triggerGlow();
            }

            // Check brick collisions
            if (this.brickManager) {
                const collisionResult = this.brickManager.checkBallCollisions(ball);
                if (collisionResult && collisionResult.brickHit) {
                    if (collisionResult.brickDestroyed) {
                        // Play destruction sound and create particle effect
                        this.soundManager.playBrickHit();
                        this.particleManager.createBrickHitParticles(
                            ball.position.x,
                            ball.position.y,
                            this.getBrickColor(collisionResult.position.row)
                        );

                        // Check if destroyed brick was an extra ball brick
                        if (collisionResult.wasExtraBallBrick) {
                            this.spawnExtraBall(ball.position.x, ball.position.y);
                        }

                        // Check if destroyed brick was a power-up brick
                        if (collisionResult.wasPowerUpBrick && collisionResult.powerUpType) {
                            this.spawnPowerUp(ball.position.x, ball.position.y, collisionResult.powerUpType);
                        }
                    } else {
                        // Brick was hit but not destroyed (two-stage brick damaged)
                        this.soundManager.playBrickDamage();
                    }

                    this.addScore(collisionResult.points);

                    // Check if all bricks are destroyed (level complete)
                    if (this.brickManager.areAllBricksDestroyed()) {
                        this.handleLevelComplete();
                    }
                }
            }
        }
    }

    getBrickColor(row) {
        // Return the color of the brick based on row for particle effects
        const colors = [COLORS.GREEN, COLORS.PURPLE, COLORS.WHITE];
        return colors[row % colors.length];
    }

    checkGameConditions() {
        // Check if any balls hit the bottom boundary and remove them
        for (let i = this.balls.length - 1; i >= 0; i--) {
            if (this.balls[i].checkBottomBoundary()) {
                // Remove the ball that hit the bottom
                const lostBall = this.balls[i];
                lostBall.removeFromStage(this.app.stage);
                lostBall.destroy();
                this.balls.splice( i, 1 );
                this.gameObjects = this.gameObjects.filter(obj => obj !== lostBall);

                console.log(`Ball lost! Balls remaining: ${this.balls.length}`);
            }
        }

        // If no balls remain, handle ball lost
        if (this.balls.length === 0) {
            this.handleBallLost();
        }
    }

    spawnExtraBall(x, y) {
        console.log('Spawning extra ball at position:', x, y);

        // Create new ball at the position where the golden brick was destroyed
        const extraBall = new Ball(GAME_WIDTH, GAME_HEIGHT);
        extraBall.position.x = x;
        extraBall.position.y = y;

        // Launch the ball immediately with a random angle
        const randomAngle = (Math.random() - 0.5) * Math.PI; // Random angle between -90 and 90 degrees
        extraBall.velocity.x = Math.cos(randomAngle) * extraBall.speed;
        extraBall.velocity.y = -Math.abs(Math.sin(randomAngle)) * extraBall.speed; // Always upward
        extraBall.isLaunched = true;

        // Add to game
        extraBall.addToStage(this.app.stage);
        this.gameObjects.push(extraBall);
        this.balls.push(extraBall);

        // Create special spawn effect
        this.particleManager.createBrickHitParticles(x, y, COLORS.GOLD);
        this.soundManager.playBrickHit(); // Play a satisfying sound

        console.log(`Extra ball spawned! Total balls: ${this.balls.length}`);
    }

    updateGameOver(delta) {
        // Future: Add game over screen animations
    }

    startGame() {
        this.transitionToGameplay();
        this.createGameObjects();

        // Start background music
        if (this.soundManager) {
            this.soundManager.playBackgroundMusic();
        }

        // Mark that the game has started so UI animations can begin
        if (this.uiManager) {
            this.uiManager.markGameStarted();
        }

        console.log('Game started!');
    }

    transitionToGameplay() {
        this.gameState = GAME_STATES.PLAYING;
        this.app.stage.removeChild(this.startScreen);
    }

    createGameObjects() {
        this.gameObjects = [];

        // Create paddle
        this.paddle = new Paddle(GAME_WIDTH, GAME_HEIGHT);
        this.paddle.addToStage(this.app.stage);
        this.gameObjects.push(this.paddle);

        // Create ball
        this.createBall();

        // Create brick manager and grid
        this.brickManager = new BrickManager(GAME_WIDTH, GAME_HEIGHT);
        this.brickManager.addBricksToStage(this.app.stage);

        // Show gameplay UI
        this.uiManager.showGameplayUI(this.app.stage);
        this.uiManager.updateScore(this.score);
        this.uiManager.updateLives(this.lives);
        this.uiManager.updateStageDisplay(this.brickManager.getCurrentStage());

        console.log(`Game objects created: ${this.brickManager.getTotalBrickCount()} bricks`);
    }

    createBall() {
        const ball = new Ball( GAME_WIDTH, GAME_HEIGHT );
        ball.addToStage( this.app.stage );
        ball.positionOnPaddle( this.paddle );
        this.gameObjects.push( ball );
        this.balls.push( ball );
    }

    handleLevelComplete() {
        console.log('Level completed! All bricks destroyed.');

        // Play victory sound and create celebration effect
        this.soundManager.playLevelComplete();
        this.particleManager.createLevelCompleteEffect(GAME_WIDTH / 2, GAME_HEIGHT / 2);

        // For now, just restart the level - future: add level progression
        setTimeout(() => {
            this.gameOver();
        }, 2000); // Wait for celebration effects
    }

    handleBallLost() {
        this.lives--;
        this.uiManager.updateLives(this.lives);

        // Play ball lost sound
        this.soundManager.playBallLost();

        console.log('Ball lost! Lives remaining:', this.lives);

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.resetBall();
        }
    }

    resetBall() {
        if (this.paddle) {
            this.createBall();
        }
    }

    gameOver() {
        this.gameState = GAME_STATES.GAME_OVER;

        // Stop background music
        if (this.soundManager) {
            this.soundManager.stopBackgroundMusic();
        }

        // Play game over sound
        this.soundManager.playGameOver();

        // Hide gameplay UI
        this.uiManager.hideGameplayUI(this.app.stage);

        // Show game over screen with score submission
        this.uiManager.showGameOverScreen(this.app.stage, this.score, 'Submitting score...');

        // Submit score to external system
        this.submitFinalScore();

        // Destroy game objects
        this.destroyGameObjects();

        console.log('Game over! Final score:', this.score);
    }

    async submitFinalScore() {
        if (this.score > 0 && this.highscoreManager.isValidScore(this.score)) {
            try {
                await this.highscoreManager.submitScore(this.score, (result) => {
                    // Update UI with submission status
                    if (result.status === 'submitting') {
                        this.uiManager.updateHighscoreStatus(result.message);
                    } else if (result.success) {
                        this.uiManager.updateHighscoreStatus(`Score submitted! Rank #${result.rank}`);
                    } else {
                        this.uiManager.updateHighscoreStatus(`Error: ${result.message}`);
                    }
                });
            } catch (error) {
                console.error('Score submission failed:', error);
                this.uiManager.updateHighscoreStatus('Failed to submit score');
            }
        } else {
            this.uiManager.updateHighscoreStatus('Score not eligible for submission');
        }
    }

    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.gameState = GAME_STATES.START;

        // Reset UI animation flags for the new game
        if (this.uiManager) {
            this.uiManager.resetAnimationFlags();
        }

        // Hide game over screen
        this.uiManager.hideGameOverScreen(this.app.stage);

        this.destroyGameObjects();
        this.app.stage.addChild(this.startScreen);
        console.log('Game reset!');
    }

    destroyGameObjects() {
        // Hide UI
        this.uiManager.hideGameplayUI(this.app.stage);

        this.gameObjects.forEach(obj => {
            obj.removeFromStage(this.app.stage);
            obj.destroy();
        });

        // Clean up power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.removeFromStage(this.app.stage);
            powerUp.destroy();
        });
        this.powerUps = [];

        // Handle brick manager separately
        if (this.brickManager) {
            this.brickManager.removeBricksFromStage(this.app.stage);
            this.brickManager.destroy();
            this.brickManager = null;
        }

        this.gameObjects = [];
        this.paddle = null;
        this.balls = [];
    }

    // Getter methods for external access
    getScore() {
        return this.score;
    }

    getLives() {
        return this.lives;
    }

    getGameState() {
        return this.gameState;
    }

    // Enhanced score management
    addScore(points) {
        this.score += points;
        this.uiManager.updateScore(this.score);
        console.log('Score updated:', this.score);
    }

    getGameWidth() {
        return GAME_WIDTH;
    }

    getGameHeight() {
        return GAME_HEIGHT;
    }

    spawnExplosionPowerUp(explosionX, explosionY, destroyedCount) {
        // Only spawn powerup if at least one brick was destroyed
        if (destroyedCount === 0) {
            return;
        }

        // Calculate spawn chance based on destroyed bricks (more bricks = higher chance)
        const baseChance = 0.3; // 30% base chance
        const bonusChance = Math.min(destroyedCount * 0.15, 0.4); // Up to 40% bonus for multiple bricks
        const spawnChance = baseChance + bonusChance;

        if (Math.random() < spawnChance) {
            // Define available powerup types with weights
            const powerUpTypes = [
                { type: 'paddleWidth', weight: 40 }, // Common utility powerup
                { type: 'bomb', weight: 25 },        // Powerful but rare
                { type: 'extraBall', weight: 35 }    // Valuable reward for good explosions
            ];

            // Select random powerup type based on weights
            const totalWeight = powerUpTypes.reduce((sum, p) => sum + p.weight, 0);
            let randomWeight = Math.random() * totalWeight;

            let selectedType = 'paddleWidth'; // Default fallback
            for (const powerUp of powerUpTypes) {
                randomWeight -= powerUp.weight;
                if (randomWeight <= 0) {
                    selectedType = powerUp.type;
                    break;
                }
            }

            // Handle extra ball spawning differently - spawn ball directly instead of powerup
            if (selectedType === 'extraBall') {
                this.spawnExtraBall(explosionX, explosionY);
                console.log(`Explosion triggered extra ball! (${destroyedCount} bricks destroyed)`);
            } else {
                // Spawn the powerup at explosion center
                this.spawnPowerUp(explosionX, explosionY, selectedType);
                console.log(`Explosion triggered powerup: ${selectedType} (${destroyedCount} bricks destroyed)`);
            }
        }
    }
}
