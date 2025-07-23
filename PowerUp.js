// PowerUp.js - Falling power-up items that can be caught by the paddle

class PowerUp extends GameObject {
    constructor(x, y, type) {
        super(x, y);
        this.type = type;
        this.width = 20;
        this.height = 20;
        this.velocity = { x: 0, y: 3 }; // Falls downward
        this.collected = false;

        this.createGraphics();
        console.log(`PowerUp of type ${type} created at (${x}, ${y})`);
    }

    createGraphics() {
        this.graphics = new PIXI.Graphics();
        this.updateGraphics();

        // Set position
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;
    }

    updateGraphics() {
        this.graphics.clear();

        if (this.type === 'paddleWidth') {
            // Light blue background circle
            this.graphics.beginFill(COLORS.LIGHT_BLUE);
            this.graphics.drawCircle(this.width / 2, this.height / 2, this.width / 2);
            this.graphics.endFill();

            // White + symbol
            const centerX = this.width / 2;
            const centerY = this.height / 2;
            const size = 6;

            this.graphics.beginFill(COLORS.WHITE);
            // Horizontal line
            this.graphics.drawRoundedRect(centerX - size, centerY - 1.5, size * 2, 3, 1);
            // Vertical line
            this.graphics.drawRoundedRect(centerX - 1.5, centerY - size, 3, size * 2, 1);
            this.graphics.endFill();

            // Add subtle glow effect
            this.graphics.beginFill(COLORS.WHITE, 0.3);
            this.graphics.drawCircle(centerX, centerY, this.width / 2 + 2);
            this.graphics.endFill();
        }
    }

    update(delta) {
        if (!this.isActive || this.collected) return;

        // Move downward
        this.position.y += this.velocity.y * delta;
        this.graphics.y = this.position.y;

        // Remove if it falls off screen
        if (this.position.y > 600) {
            this.isActive = false;
        }
    }

    checkPaddleCollision(paddle) {
        if (this.collected || !this.isActive) return false;

        // Simple AABB collision detection
        return (this.position.x < paddle.position.x + paddle.width &&
                this.position.x + this.width > paddle.position.x &&
                this.position.y < paddle.position.y + paddle.height &&
                this.position.y + this.height > paddle.position.y);
    }

    collect() {
        this.collected = true;
        this.isActive = false;
        console.log(`PowerUp collected: ${this.type}`);
    }
}
