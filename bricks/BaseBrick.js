// BaseBrick.js - Base class for all brick types

// Brick constants
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 25;

class BaseBrick extends GameObject {
    constructor(x, y, color, points = 10, maxHits = 1) {
        super(x, y);

        this.width = BRICK_WIDTH;
        this.height = BRICK_HEIGHT;
        this.color = color;
        this.originalColor = color;
        this.points = points;
        this.hitStage = 0;
        this.maxHitStages = maxHits;
        this.isDamaged = false;

        this.createGraphics();
        console.log(`${this.constructor.name} created at (${x}, ${y})`);
    }

    createGraphics() {
        this.graphics = new PIXI.Graphics();
        this.updateBrickGraphics();

        // Set position
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;
    }

    hit() {
        this.hitStage++;

        if (this.hitStage >= this.maxHitStages) {
            // Brick is destroyed
            this.isActive = false;
            console.log(`${this.constructor.name} destroyed! Points awarded: ${this.points}`);
            this.onDestroy();
            return this.points;
        } else {
            // Brick is damaged but not destroyed
            this.isDamaged = true;
            this.onDamage();
            this.updateBrickGraphics();
            console.log(`${this.constructor.name} damaged! Points: ${this.points}`);
            return this.points;
        }
    }

    // Template methods for subclasses to override
    onDamage() {
        // Override in subclasses for specific damage behavior
    }

    onDestroy() {
        // Override in subclasses for specific destruction behavior
    }

    updateBrickGraphics() {
        this.graphics.clear();

        // Shadow layer
        this.graphics.beginFill(COLORS.BLACK, 0.3);
        this.graphics.drawRoundedRect(2, 2, this.width, this.height, 5);
        this.graphics.endFill();

        // Main brick body
        const mainColor = this.getCurrentColor();
        this.graphics.beginFill(mainColor);
        this.graphics.drawRoundedRect(0, 0, this.width, this.height, 5);
        this.graphics.endFill();

        // Apply special effects
        this.applySpecialEffects();

        // Top highlight for 3D effect
        const highlightColor = this.getLighterColor(mainColor);
        this.graphics.beginFill(highlightColor, 0.7);
        this.graphics.drawRoundedRect(0, 0, this.width, this.height * 0.3, 5);
        this.graphics.endFill();

        // Side highlight
        this.graphics.beginFill(highlightColor, 0.4);
        this.graphics.drawRoundedRect(0, 0, this.width * 0.2, this.height, 5);
        this.graphics.endFill();

        // Sleek border
        const borderColor = this.color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
        this.graphics.lineStyle(2, borderColor, 0.8);
        this.graphics.drawRoundedRect(0, 0, this.width, this.height, 5);

        // Inner glow
        this.graphics.lineStyle(1, mainColor, 0.6);
        this.graphics.drawRoundedRect(1, 1, this.width - 2, this.height - 2, 4);

        // Apply damage indicators
        this.applyDamageIndicators();
    }

    // Template methods for customization
    getCurrentColor() {
        return this.color;
    }

    applySpecialEffects() {
        // Override in subclasses for special visual effects
    }

    applyDamageIndicators() {
        // Override in subclasses for damage visualization
    }

    getLighterColor(color) {
        switch (color) {
            case COLORS.RED:
                return 0xFF4444;
            case COLORS.GREEN:
                return 0xAAFF55;
            case COLORS.PURPLE:
                return 0xA65EBA;
            case COLORS.DARK_PURPLE:
                return 0x8A4BA8;
            case 0x3D1A4A: // Darker damaged purple
                return 0x6B2E7A;
            case COLORS.WHITE:
                return 0xFFFFFF;
            case COLORS.GOLD:
                return 0xFFE55C;
            default:
                return 0xFFFFFF;
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

    destroy() {
        super.destroy();
    }
}
