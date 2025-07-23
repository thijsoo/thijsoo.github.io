// Paddle.js - Handles paddle creation, movement, and physics

// Paddle constants
const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 20;
const PADDLE_SPEED = 8;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_WIDTH_BONUS_DURATION = 900; // 15 seconds at 60fps

class Paddle extends GameObject {
    constructor(gameWidth, gameHeight) {
        // Call parent constructor with initial position
        const startX = (gameWidth - PADDLE_WIDTH) / 2;
        const startY = gameHeight - PADDLE_MARGIN_BOTTOM;
        super(startX, startY);

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.speed = PADDLE_SPEED;
        this.width = PADDLE_WIDTH;
        this.originalWidth = PADDLE_WIDTH; // Store original width for reset
        this.height = PADDLE_HEIGHT;

        // Animation properties
        this.glowIntensity = 0;
        this.targetGlow = 0;

        // Power-up properties
        this.widthBonusTimer = 0;
        this.hasWidthBonus = false;

        this.createGraphics();
        console.log('Paddle created at position:', this.position.x, this.position.y);
    }

    createGraphics() {
        this.graphics = new PIXI.Graphics();
        this.updatePaddleGraphics();

        // Set initial position
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;
    }

    updatePaddleGraphics() {
        this.graphics.clear();

        // Create gradient effect with multiple layers
        // Bottom shadow layer
        this.graphics.beginFill(COLORS.BLACK, 0.3);
        this.graphics.drawRoundedRect(2, 2, this.width, this.height, 8);
        this.graphics.endFill();

        // Main paddle body with gradient effect
        this.graphics.beginFill(COLORS.GREEN);
        this.graphics.drawRoundedRect(0, 0, this.width, this.height, 8);
        this.graphics.endFill();

        // Top highlight
        this.graphics.beginFill(0x99D455, 0.6); // Lighter green
        this.graphics.drawRoundedRect(0, 0, this.width, this.height * 0.4, 8);
        this.graphics.endFill();

        // Glow effect when active
        if (this.glowIntensity > 0) {
            this.graphics.lineStyle(3, COLORS.WHITE, this.glowIntensity * 0.8);
            this.graphics.drawRoundedRect(-1, -1, this.width + 2, this.height + 2, 9);
        }

        // Sleek border
        this.graphics.lineStyle(2, COLORS.WHITE, 0.8);
        this.graphics.drawRoundedRect(0, 0, this.width, this.height, 8);
    }

    update(delta, inputManager) {
        if (!this.isActive) return;

        this.handleMovement(delta, inputManager);
        this.clampToBounds();
        this.updateAnimations(delta);
        this.updatePowerUps(delta);
    }

    updateAnimations(delta) {
        // Smooth glow animation
        const glowSpeed = 5;
        if (this.glowIntensity !== this.targetGlow) {
            if (this.glowIntensity < this.targetGlow) {
                this.glowIntensity = Math.min(this.targetGlow, this.glowIntensity + glowSpeed * delta);
            } else {
                this.glowIntensity = Math.max(this.targetGlow, this.glowIntensity - glowSpeed * delta);
            }
            this.updatePaddleGraphics();
        }
    }

    updatePowerUps(delta) {
        // Handle width bonus timer
        if (this.hasWidthBonus && this.widthBonusTimer > 0) {
            this.widthBonusTimer -= delta;
            if (this.widthBonusTimer <= 0) {
                this.resetWidth();
            }
        }
    }

    triggerGlow() {
        this.targetGlow = 1;
        setTimeout(() => {
            this.targetGlow = 0;
        }, 200);
    }

    handleMovement(delta, inputManager) {
        let newX = this.position.x;

        if (inputManager.isLeftPressed() && newX > 0) {
            newX -= this.speed * delta;
        }
        if (inputManager.isRightPressed() && newX < this.gameWidth - this.width) {
            newX += this.speed * delta;
        }

        this.setPosition(newX, this.position.y);
    }

    clampToBounds() {
        const clampedX = Math.max(0, Math.min(this.position.x, this.gameWidth - this.width));
        if (clampedX !== this.position.x) {
            this.setPosition(clampedX, this.position.y);
        }
    }

    getBounds() {
        return {
            left: this.position.x,
            right: this.position.x + this.width,
            top: this.position.y,
            bottom: this.position.y + this.height,
            width: this.width,
            height: this.height
        };
    }

    getCenterX() {
        return this.position.x + (this.width / 2);
    }

    resetPosition() {
        const centerX = (this.gameWidth - this.width) / 2;
        const bottomY = this.gameHeight - PADDLE_MARGIN_BOTTOM;
        this.setPosition(centerX, bottomY);
    }

    increaseWidth() {
        if (!this.hasWidthBonus) {
            const oldCenterX = this.getCenterX();
            this.width = this.originalWidth + 40; // Increase width by 40 pixels
            this.hasWidthBonus = true;
            this.widthBonusTimer = PADDLE_WIDTH_BONUS_DURATION;

            // Adjust position to keep paddle centered
            const newX = oldCenterX - (this.width / 2);
            this.setPosition(newX, this.position.y);

            this.updatePaddleGraphics();
            console.log('Paddle width increased!');
        } else {
            // If already has bonus, just reset the timer
            this.widthBonusTimer = PADDLE_WIDTH_BONUS_DURATION;
            console.log('Paddle width bonus timer extended!');
        }
    }

    resetWidth() {
        if (this.hasWidthBonus) {
            const oldCenterX = this.getCenterX();
            this.width = this.originalWidth;
            this.hasWidthBonus = false;
            this.widthBonusTimer = 0;

            // Adjust position to keep paddle centered
            const newX = oldCenterX - (this.width / 2);
            this.setPosition(newX, this.position.y);

            this.updatePaddleGraphics();
            console.log('Paddle width reset to normal');
        }
    }
}
