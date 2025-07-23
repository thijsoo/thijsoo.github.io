// UIManager.js - Handles all UI elements including score, lives, and game screens

class UIManager {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        // UI containers
        this.gameplayUI = null;
        this.gameOverScreen = null;

        // UI elements
        this.scoreText = null;
        this.livesText = null;
        this.stageText = null;
        this.gameOverText = null;
        this.finalScoreText = null;
        this.highscoreText = null;

        // Animation properties
        this.scoreAnimation = { scale: 1, targetScale: 1 };
        this.livesAnimation = { scale: 1, targetScale: 1 };

        // Track if game has started to prevent initial animations
        this.gameStarted = false;
        this.initialScoreSet = false;

        this.createGameplayUI();
    }

    createGameplayUI() {
        this.gameplayUI = new PIXI.Container();

        // Create stylized background panel for UI
        const uiBackground = new PIXI.Graphics();
        uiBackground.beginFill(COLORS.BLACK, 0.3);
        uiBackground.drawRoundedRect(10, 10, this.gameWidth - 20, 50, 10);
        uiBackground.endFill();

        uiBackground.lineStyle(2, COLORS.GREEN, 0.5);
        uiBackground.drawRoundedRect(10, 10, this.gameWidth - 20, 50, 10);

        this.gameplayUI.addChild(uiBackground);

        // Stage display with enhanced styling (left side)
        this.stageText = this.createStylizedText('Stage: 1', {
            fontSize: 24,
            fill: COLORS.WHITE,
            fontWeight: 'bold',
            stroke: COLORS.BLACK,
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: COLORS.BLACK,
            dropShadowDistance: 2,
            dropShadowAngle: Math.PI / 4
        });
        this.stageText.position.set(25, 25);

        // Score display with enhanced styling (centered)
        this.scoreText = this.createStylizedText('Score: 0', {
            fontSize: 24,
            fill: COLORS.WHITE,
            fontWeight: 'bold',
            stroke: COLORS.BLACK,
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: COLORS.BLACK,
            dropShadowDistance: 2,
            dropShadowAngle: Math.PI / 4
        });
        this.scoreText.anchor.set(0.5, 0);
        this.scoreText.position.set(this.gameWidth / 2, 25);

        // Lives display with enhanced styling (right side)
        this.livesText = this.createStylizedText('Lives: 3', {
            fontSize: 24,
            fill: COLORS.WHITE,
            fontWeight: 'bold',
            stroke: COLORS.BLACK,
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: COLORS.BLACK,
            dropShadowDistance: 2,
            dropShadowAngle: Math.PI / 4
        });
        this.livesText.position.set(this.gameWidth - 150, 25);

        // Add to container
        this.gameplayUI.addChild(this.stageText);
        this.gameplayUI.addChild(this.scoreText);
        this.gameplayUI.addChild(this.livesText);
    }

    createGameOverScreen(isVictory = false) {
        this.gameOverScreen = new PIXI.Container();

        // Animated background with gradient
        const background = new PIXI.Graphics();
        background.beginFill(COLORS.BLACK, 0.85);
        background.drawRect(0, 0, this.gameWidth, this.gameHeight);
        background.endFill();

        // Add animated border effect
        background.lineStyle(4, COLORS.GREEN, 0.8);
        background.drawRect(50, 50, this.gameWidth - 100, this.gameHeight - 100);

        // Game Over title with spectacular styling
        const gameOverTitle = this.createStylizedText(isVictory ? 'YOU WIN!' : 'GAME OVER', {
            fontSize: 56,
            fill: [COLORS.GREEN, COLORS.PURPLE],
            fontWeight: 'bold',
            stroke: COLORS.WHITE,
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: COLORS.BLACK,
            dropShadowDistance: 4,
            dropShadowAngle: Math.PI / 4
        });
        gameOverTitle.anchor.set(0.5);
        gameOverTitle.position.set(this.gameWidth / 2, this.gameHeight / 2 - 120);

        // Final score with glow effect
        this.finalScoreText = this.createStylizedText('Final Score: 0', {
            fontSize: 36,
            fill: [COLORS.WHITE, COLORS.GREEN],
            fontWeight: 'bold',
            stroke: COLORS.BLACK,
            strokeThickness: 2,
            dropShadow: true,
            dropShadowColor: COLORS.GREEN,
            dropShadowDistance: 3,
            dropShadowAngle: Math.PI / 4
        });
        this.finalScoreText.anchor.set(0.5);
        this.finalScoreText.position.set(this.gameWidth / 2, this.gameHeight / 2 - 50);

        // Highscore status with style
        this.highscoreText = this.createStylizedText('Submitting score...', {
            fontSize: 20,
            fill: [COLORS.PURPLE, COLORS.WHITE],
            fontStyle: 'italic',
            stroke: COLORS.BLACK,
            strokeThickness: 1
        });
        this.highscoreText.anchor.set(0.5);
        this.highscoreText.position.set(this.gameWidth / 2, this.gameHeight / 2);

        // Restart instructions with pulsing effect
        const restartText = this.createStylizedText('Press SPACEBAR to play again', {
            fontSize: 24,
            fill: [COLORS.WHITE, COLORS.GREEN],
            fontWeight: 'bold',
            stroke: COLORS.BLACK,
            strokeThickness: 2
        });
        restartText.anchor.set(0.5);
        restartText.position.set(this.gameWidth / 2, this.gameHeight / 2 + 80);

        // Add all elements
        this.gameOverScreen.addChild(background);
        this.gameOverScreen.addChild(gameOverTitle);
        this.gameOverScreen.addChild(this.finalScoreText);
        this.gameOverScreen.addChild(this.highscoreText);
        this.gameOverScreen.addChild(restartText);
    }

    createStylizedText(content, style) {
        const defaultStyle = {
            fontFamily: 'Arial, sans-serif',
            align: 'center'
        };
        const textStyle = new PIXI.TextStyle({ ...defaultStyle, ...style });
        return new PIXI.Text(content, textStyle);
    }

    updateScore(score) {
        if (this.scoreText) {
            this.scoreText.text = `Score: ${score.toLocaleString()}`;

            // Only trigger animation if the game has started and this isn't the initial score
            if (this.gameStarted && this.initialScoreSet) {
                this.triggerScoreAnimation();
            }

            // Mark that initial score has been set
            if (!this.initialScoreSet) {
                this.initialScoreSet = true;
            }
        }
    }

    updateLives(lives) {
        if (this.livesText) {
            this.livesText.text = `Lives: ${lives}`;

            // Only trigger animation if the game has started (lives changes are usually meaningful)
            if (this.gameStarted) {
                this.triggerLivesAnimation();
            }

            // Color coding based on lives remaining
            if (lives <= 1) {
                this.livesText.style.fill = COLORS.RED; // Red for critical (1 life)
            } else if (lives <= 2) {
                this.livesText.style.fill = COLORS.ORANGE; // Orange for warning (2 lives)
            } else {
                this.livesText.style.fill = COLORS.GREEN; // Green for safe (3+ lives)
            }
        }
    }

    updateStageDisplay(stage) {
        if (this.stageText) {
            this.stageText.text = `Stage: ${stage}`;

            // Trigger a subtle animation when stage changes
            if (this.gameStarted) {
                this.triggerStageAnimation();
            }
        }
    }

    triggerScoreAnimation() {
        // Much more subtle animation - only 1.05x scale instead of 1.2x
        this.scoreAnimation.targetScale = 1.05;
        setTimeout(() => {
            this.scoreAnimation.targetScale = 1;
        }, 100); // Shorter duration
    }

    triggerLivesAnimation() {
        // More subtle animation for lives too
        this.livesAnimation.targetScale = 1.1;
        setTimeout(() => {
            this.livesAnimation.targetScale = 1;
        }, 150); // Shorter duration
    }

    triggerStageAnimation() {
        // Create a more noticeable animation for stage changes
        if (this.stageText) {
            const originalScale = this.stageText.scale.x;
            this.stageText.scale.set(1.3);

            // Animate back to normal size
            const animate = () => {
                this.stageText.scale.x = Math.max(originalScale, this.stageText.scale.x - 0.02);
                this.stageText.scale.y = this.stageText.scale.x;

                if (this.stageText.scale.x > originalScale) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        }
    }

    updateAnimations(delta) {
        // Animate score text
        if (this.scoreText && this.scoreAnimation.scale !== this.scoreAnimation.targetScale) {
            const speed = 8;
            if (this.scoreAnimation.scale < this.scoreAnimation.targetScale) {
                this.scoreAnimation.scale = Math.min(this.scoreAnimation.targetScale,
                    this.scoreAnimation.scale + speed * delta);
            } else {
                this.scoreAnimation.scale = Math.max(this.scoreAnimation.targetScale,
                    this.scoreAnimation.scale - speed * delta);
            }
            this.scoreText.scale.set(this.scoreAnimation.scale);
        }

        // Animate lives text
        if (this.livesText && this.livesAnimation.scale !== this.livesAnimation.targetScale) {
            const speed = 10;
            if (this.livesAnimation.scale < this.livesAnimation.targetScale) {
                this.livesAnimation.scale = Math.min(this.livesAnimation.targetScale,
                    this.livesAnimation.scale + speed * delta);
            } else {
                this.livesAnimation.scale = Math.max(this.livesAnimation.targetScale,
                    this.livesAnimation.scale - speed * delta);
            }
            this.livesText.scale.set(this.livesAnimation.scale);
        }
    }

    showGameplayUI(stage) {
        if (this.gameplayUI && stage) {
            stage.addChild(this.gameplayUI);
        }
    }

    hideGameplayUI(stage) {
        if (this.gameplayUI && stage) {
            stage.removeChild(this.gameplayUI);
        }
    }

    showGameOverScreen(stage, finalScore, highscoreStatus = null, isVictory = false) {
        // Always recreate the screen with the appropriate message
        if (this.gameOverScreen) {
            this.gameOverScreen.destroy({ children: true });
        }
        this.createGameOverScreen(isVictory);

        // Update final score
        if (this.finalScoreText) {
            this.finalScoreText.text = `Final Score: ${finalScore.toLocaleString()}`;
        }

        // Update highscore status
        if (this.highscoreText && highscoreStatus) {
            this.highscoreText.text = highscoreStatus;
        }

        if (stage) {
            stage.addChild(this.gameOverScreen);
        }
    }

    hideGameOverScreen(stage) {
        if (this.gameOverScreen && stage) {
            stage.removeChild(this.gameOverScreen);
        }
    }

    updateHighscoreStatus(status) {
        if (this.highscoreText) {
            this.highscoreText.text = status;

            // Change color based on status
            if (status.includes('Error') || status.includes('Failed')) {
                this.highscoreText.style.fill = COLORS.GREEN; // Changed from ORANGE to GREEN
            } else if (status.includes('Success') || status.includes('Submitted')) {
                this.highscoreText.style.fill = COLORS.PURPLE;
            } else {
                this.highscoreText.style.fill = COLORS.WHITE;
            }
        }
    }

    destroy() {
        if (this.gameplayUI) {
            this.gameplayUI.destroy({ children: true });
            this.gameplayUI = null;
        }

        if (this.gameOverScreen) {
            this.gameOverScreen.destroy({ children: true });
            this.gameOverScreen = null;
        }
    }

    // Method to mark that the game has started and animations should be enabled
    markGameStarted() {
        this.gameStarted = true;
    }

    // Method to reset animation flags when game resets
    resetAnimationFlags() {
        this.gameStarted = false;
        this.initialScoreSet = false;
    }
}
