// Cheat.js - Development cheat commands (remove for production)

class CheatManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.setupCheatCommands();
    }

    setupCheatCommands() {
        // Make cheat function globally available in console
        window.cheat = () => {
            return this.advanceStage();
        };

        // Additional cheat commands can be added here
        window.cheatWin = () => {
            return this.winLevel();
        };

        window.cheatLives = (lives = 9) => {
            return this.setLives(lives);
        };

        console.log('🎮 Cheat commands available:');
        console.log('  - cheat()        : Advance to next stage');
        console.log('  - cheatWin()     : Win current level');
        console.log('  - cheatLives(n)  : Set lives to n (default: 9)');
    }

    advanceStage() {
        const gameState = this.gameManager.getGameState();
        const brickManager = this.gameManager.brickManager;

        if (gameState === GAME_STATES.PLAYING && brickManager) {
            console.log(`Current stage: ${brickManager.getCurrentStage()}`);

            if (brickManager.hasMoreStages()) {
                // Remove current bricks from stage
                brickManager.removeBricksFromStage(this.gameManager.app.stage);

                // Advance to next stage
                brickManager.nextStage();

                // Add new bricks to stage
                brickManager.addBricksToStage(this.gameManager.app.stage);

                // Reset ball position
                if (this.gameManager.ball) {
                    this.gameManager.ball.reset();
                }

                console.log(`✅ Cheated to stage: ${brickManager.getCurrentStage()}`);

                // Update UI to reflect new stage
                if (this.gameManager.uiManager) {
                    this.gameManager.uiManager.updateStageDisplay(brickManager.getCurrentStage());
                }

                return `Advanced to stage ${brickManager.getCurrentStage()}`;
            } else {
                console.log('⚠️  Already at the final stage!');
                return 'Already at final stage';
            }
        } else {
            console.log('❌ Cheat can only be used during gameplay!');
            return 'Not in gameplay mode';
        }
    }

    winLevel() {
        const gameState = this.gameManager.getGameState();
        const brickManager = this.gameManager.brickManager;

        if (gameState === GAME_STATES.PLAYING && brickManager) {
            // Destroy all remaining bricks
            const activeBricks = brickManager.getAllActiveBricks();
            activeBricks.forEach(brick => {
                if (brick && brick.isActive) {
                    brick.hit(); // Hit once
                    if (brick.isActive) {
                        brick.hit(); // Hit twice to ensure destruction
                    }
                }
            });

            // Force brick manager to recalculate active bricks
            brickManager.activeBricks = 0;

            console.log('🏆 All bricks destroyed! Level completed via cheat.');
            return 'Level completed';
        } else {
            console.log('❌ Win cheat can only be used during gameplay!');
            return 'Not in gameplay mode';
        }
    }

    setLives(lives) {
        if (typeof lives !== 'number' || lives < 0 || lives > 99) {
            console.log('❌ Invalid lives count. Use a number between 0-99.');
            return 'Invalid lives count';
        }

        if (this.gameManager.getGameState() === GAME_STATES.PLAYING) {
            this.gameManager.lives = lives;

            if (this.gameManager.uiManager) {
                this.gameManager.uiManager.updateLives(lives);
            }

            console.log(`💖 Lives set to: ${lives}`);
            return `Lives set to ${lives}`;
        } else {
            console.log('❌ Lives cheat can only be used during gameplay!');
            return 'Not in gameplay mode';
        }
    }

    // Method to cleanly remove all cheat commands
    removeCheatCommands() {
        delete window.cheat;
        delete window.cheatWin;
        delete window.cheatLives;
        console.log('🚫 Cheat commands removed');
    }
}
