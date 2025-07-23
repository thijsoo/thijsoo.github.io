// BrickManager.js - Manages the brick grid layout and interactions

// Grid constants
const BRICK_SPACING = 5;
const BRICK_GRID_TOP_MARGIN = 80;
const BRICK_GRID_SIDE_MARGIN = 15;

class BrickManager {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.bricks = [];
        this.totalBricks = 0;
        this.activeBricks = 0;
        this.currentStage = 0;

        this.calculateGridDimensions();
        this.createBrickGrid();
    }

    calculateGridDimensions() {
        // Get current stage layout
        const currentStageLayout = STAGES[this.currentStage].layout;
        const BRICK_ROWS = currentStageLayout.length;
        const BRICK_COLS = currentStageLayout[0].length;

        // Calculate grid positioning to center it
        this.gridWidth = (BRICK_COLS * BRICK_WIDTH) + ((BRICK_COLS - 1) * BRICK_SPACING);
        this.gridHeight = (BRICK_ROWS * BRICK_HEIGHT) + ((BRICK_ROWS - 1) * BRICK_SPACING);

        // Center the grid horizontally
        this.gridStartX = (this.gameWidth - this.gridWidth) / 2;
        this.gridStartY = BRICK_GRID_TOP_MARGIN;

        console.log(`Stage ${this.currentStage + 1} brick grid dimensions: ${this.gridWidth}x${this.gridHeight}`);
        console.log(`Grid positioned at: (${this.gridStartX}, ${this.gridStartY})`);
    }

    createBrickGrid() {
        this.bricks = [];
        this.totalBricks = 0;

        // Get current stage layout
        const currentStageLayout = STAGES[this.currentStage].layout;
        const BRICK_ROWS = currentStageLayout.length;
        const BRICK_COLS = currentStageLayout[0].length;

        for (let row = 0; row < BRICK_ROWS; row++) {
            this.bricks[row] = [];

            for (let col = 0; col < BRICK_COLS; col++) {
                // Check if this position should have a brick (>0) or be empty (0)
                const brickType = currentStageLayout[row][col];
                if (brickType > 0) {
                    const x = this.gridStartX + (col * (BRICK_WIDTH + BRICK_SPACING));
                    const y = this.gridStartY + (row * (BRICK_HEIGHT + BRICK_SPACING));

                    // Convert layout value (1-4) to brick color index (0-3)
                    const colorIndex = brickType - 1;

                    const brick = BrickFactory.createBrick(x, y, colorIndex);
                    this.bricks[row][col] = brick;
                    this.totalBricks++;
                } else {
                    // Empty space
                    this.bricks[row][col] = null;
                }
            }
        }

        this.activeBricks = this.totalBricks;
        console.log(`Created ${this.totalBricks} bricks for Stage ${this.currentStage + 1}`);
    }

    addBricksToStage(stage) {
        this.bricks.forEach(row => {
            row.forEach(brick => {
                if (brick && brick.isActive) {
                    brick.addToStage(stage);
                }
            });
        });
    }

    removeBricksFromStage(stage) {
        this.bricks.forEach(row => {
            row.forEach(brick => {
                if (brick) {
                    brick.removeFromStage(stage);
                }
            });
        });
    }

    checkBallCollisions(ball) {
        if (!ball || !ball.isLaunched) return null;

        // Get current stage layout for dynamic row/col limits
        const currentStageLayout = STAGES[this.currentStage].layout;
        const BRICK_ROWS = currentStageLayout.length;
        const BRICK_COLS = currentStageLayout[0].length;

        // Find the closest brick that the ball is colliding with
        let closestBrick = null;
        let closestDistance = Infinity;
        let closestBrickInfo = null;

        // Check collision with each active brick
        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                const brick = this.bricks[row][col];

                if (brick && brick.isActive && ball.checkBrickCollision(brick)) {
                    // Calculate distance from ball center to brick center
                    const ballBounds = ball.getBounds();
                    const brickBounds = brick.getBounds();

                    const ballCenterX = ballBounds.centerX;
                    const ballCenterY = ballBounds.centerY;
                    const brickCenterX = (brickBounds.left + brickBounds.right) / 2;
                    const brickCenterY = (brickBounds.top + brickBounds.bottom) / 2;

                    const distance = Math.sqrt(
                        Math.pow(ballCenterX - brickCenterX, 2) +
                        Math.pow(ballCenterY - brickCenterY, 2)
                    );

                    // Keep track of the closest colliding brick
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestBrick = brick;
                        closestBrickInfo = { row, col };
                    }
                }
            }
        }

        // If we found a collision, handle only the closest brick
        if (closestBrick) {
            // Store if this was an extra ball brick before destroying it
            const wasExtraBallBrick = closestBrick.isExtraBallBrick;
            // Store if this was a power-up brick before destroying it
            const wasPowerUpBrick = closestBrick.isPowerUpBrick;
            const powerUpType = wasPowerUpBrick ? closestBrick.powerUpType : null;

            // Handle collision with the closest brick only
            ball.handleBrickBounce(closestBrick);
            const points = closestBrick.hit();

            let brickDestroyed = false;

            // Only remove brick if it's actually destroyed
            if (!closestBrick.isActive) {
                closestBrick.removeFromStage(closestBrick.graphics.parent);
                closestBrick.destroy();
                this.activeBricks--;
                brickDestroyed = true;
                console.log(`Brick destroyed at (${closestBrickInfo.row}, ${closestBrickInfo.col})! Active bricks remaining: ${this.activeBricks}${wasExtraBallBrick ? ' (Extra Ball Brick!)' : ''}${wasPowerUpBrick ? ' (PowerUp Brick!)' : ''}`);
            } else {
                console.log(`Brick hit but not destroyed at (${closestBrickInfo.row}, ${closestBrickInfo.col})! Brick transformed.`);
            }

            return {
                points: points,
                brickDestroyed: brickDestroyed,
                brickHit: true,
                position: closestBrickInfo,
                wasExtraBallBrick: wasExtraBallBrick && brickDestroyed,
                wasPowerUpBrick: wasPowerUpBrick && brickDestroyed,
                powerUpType: powerUpType
            };
        }

        return null;
    }

    getAllActiveBricks() {
        const activeBricks = [];
        this.bricks.forEach(row => {
            row.forEach(brick => {
                if (brick && brick.isActive) {
                    activeBricks.push(brick);
                }
            });
        });
        return activeBricks;
    }

    areAllBricksDestroyed() {
        return this.activeBricks === 0;
    }

    getActiveBrickCount() {
        return this.activeBricks;
    }

    getTotalBrickCount() {
        return this.totalBricks;
    }

    // Reset all bricks for new game
    reset() {
        this.bricks.forEach(row => {
            row.forEach(brick => {
                if (brick) {
                    brick.destroy();
                }
            });
        });

        this.createBrickGrid();
    }

    destroy() {
        this.bricks.forEach(row => {
            row.forEach(brick => {
                if (brick) {
                    brick.destroy();
                }
            });
        });

        this.bricks = [];
        this.totalBricks = 0;
        this.activeBricks = 0;
    }

    // Method to advance to next stage
    nextStage() {
        if (this.currentStage < STAGES.length - 1) {
            this.currentStage++;
            this.calculateGridDimensions();
            this.createBrickGrid();
            return true;
        }
        return false; // No more stages
    }

    // Method to get current stage number (1-based)
    getCurrentStage() {
        return this.currentStage + 1;
    }

    // Method to check if there are more stages
    hasMoreStages() {
        return this.currentStage < STAGES.length - 1;
    }
}
