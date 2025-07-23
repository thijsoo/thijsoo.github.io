// PowerUpBrick.js - Brick that drops paddle width increase power-up

class PowerUpBrick extends BaseBrick {
    constructor(x, y) {
        super(x, y, COLORS.LIGHT_BLUE, 75, 1); // Light blue color, 75 points, 1 hit to destroy
        this.isPowerUpBrick = true;
        this.powerUpType = 'paddleWidth';
    }

    applySpecialEffects() {
        // Light blue glow effect for power-up bricks
        this.graphics.beginFill(COLORS.LIGHT_BLUE, 0.3);
        this.graphics.drawRoundedRect(-2, -2, this.width + 4, this.height + 4, 7);
        this.graphics.endFill();

        // Add + icon in the center
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const size = 8;

        // Draw + symbol
        this.graphics.beginFill(COLORS.WHITE);
        // Horizontal line
        this.graphics.drawRoundedRect(centerX - size, centerY - 2, size * 2, 4, 2);
        // Vertical line
        this.graphics.drawRoundedRect(centerX - 2, centerY - size, 4, size * 2, 2);
        this.graphics.endFill();
    }

    onDestroy() {
        console.log('PowerUp brick destroyed! Paddle width power-up will drop!');
    }
}
