// GoldenBrick.js - Golden brick that spawns extra balls

class GoldenBrick extends BaseBrick {
    constructor(x, y) {
        super(x, y, COLORS.GOLD, 50, 1); // Gold color, 50 points, 1 hit to destroy
        this.isExtraBallBrick = true;
    }

    applySpecialEffects() {
        // Golden glow effect for extra ball bricks
        this.graphics.beginFill(COLORS.YELLOW, 0.4);
        this.graphics.drawRoundedRect(-2, -2, this.width + 4, this.height + 4, 7);
        this.graphics.endFill();

        // Add extra ball icon in the center
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        this.graphics.beginFill(COLORS.WHITE);
        this.graphics.drawCircle(centerX, centerY, 4);
        this.graphics.endFill();
        this.graphics.beginFill(COLORS.BLACK, 0.3);
        this.graphics.drawCircle(centerX + 1, centerY + 1, 3);
        this.graphics.endFill();
    }

    onDestroy() {
        console.log('Golden brick destroyed! Extra ball will spawn!');
    }
}
