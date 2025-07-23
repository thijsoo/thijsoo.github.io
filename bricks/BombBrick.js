// BombBrick.js - Brick that drops bomb power-up

class BombBrick extends BaseBrick {
    constructor(x, y) {
        super(x, y, COLORS.ORANGE, 150, 1); // Orange color, 150 points, 1 hit to destroy
        this.isPowerUpBrick = true;
        this.powerUpType = 'bomb';
    }

    applySpecialEffects() {
        // Orange glow effect for bomb bricks
        this.graphics.beginFill(COLORS.ORANGE, 0.4);
        this.graphics.drawRoundedRect(-2, -2, this.width + 4, this.height + 4, 7);
        this.graphics.endFill();

        // Add bomb icon in the center
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        // Draw bomb body (circle)
        this.graphics.beginFill(COLORS.BLACK);
        this.graphics.drawCircle(centerX, centerY + 2, 8);
        this.graphics.endFill();

        // Draw bomb fuse
        this.graphics.beginFill(COLORS.YELLOW);
        this.graphics.drawRoundedRect(centerX - 1, centerY - 6, 2, 8, 1);
        this.graphics.endFill();

        // Draw spark at top of fuse
        this.graphics.beginFill(COLORS.RED);
        this.graphics.drawCircle(centerX, centerY - 7, 2);
        this.graphics.endFill();

        // Add highlight on bomb
        this.graphics.beginFill(COLORS.WHITE, 0.6);
        this.graphics.drawCircle(centerX - 3, centerY - 1, 2);
        this.graphics.endFill();
    }

    onDestroy() {
        console.log('Bomb brick destroyed! Bomb power-up will drop!');
    }
}
