// DarkPurpleBrick.js - Dark purple brick that darkens when damaged

class DarkPurpleBrick extends BaseBrick {
    constructor(x, y) {
        super(x, y, COLORS.DARK_PURPLE, 30, 2); // Dark purple color, 30 points, 2 hits to destroy
    }

    getCurrentColor() {
        // Return darker color when damaged
        if (this.isDamaged) {
            return 0x3D1A4A; // Darker purple when damaged
        }
        return this.color;
    }

    onDamage() {
        console.log('Dark purple brick hit once! Next hit will destroy it.');
    }

    applyDamageIndicators() {
        if (this.isDamaged) {
            // Draw crack lines when damaged
            this.graphics.lineStyle(1, COLORS.BLACK, 0.5);
            this.graphics.moveTo(10, 5);
            this.graphics.lineTo(20, 15);
            this.graphics.moveTo(30, 8);
            this.graphics.lineTo(40, 18);
            this.graphics.moveTo(50, 6);
            this.graphics.lineTo(60, 12);
        }
    }
}
