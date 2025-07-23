// GameObject.js - Base class for all game objects

class GameObject {
    constructor(x = 0, y = 0) {
        this.position = { x, y };
        this.graphics = null;
        this.isActive = true;
        this.isDestroyed = false;
    }

    // Abstract methods to be implemented by subclasses
    createGraphics() {
        throw new Error('createGraphics() must be implemented by subclass');
    }

    update(delta) {
        // Base update logic - can be overridden
    }

    // Position management
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        if (this.graphics) {
            this.graphics.x = x;
            this.graphics.y = y;
        }
    }

    getPosition() {
        return { ...this.position };
    }

    // Bounds checking - to be implemented by subclasses
    getBounds() {
        throw new Error('getBounds() must be implemented by subclass');
    }

    // Collision detection helper
    checkCollision(other) {
        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();

        return bounds1.right >= bounds2.left &&
               bounds1.left <= bounds2.right &&
               bounds1.bottom >= bounds2.top &&
               bounds1.top <= bounds2.bottom;
    }

    // Lifecycle management
    destroy() {
        this.isDestroyed = true;
        this.isActive = false;
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }
    }

    // Add to stage
    addToStage(stage) {
        if (this.graphics && stage) {
            stage.addChild(this.graphics);
        }
    }

    // Remove from stage
    removeFromStage(stage) {
        if (this.graphics && stage) {
            stage.removeChild(this.graphics);
        }
    }
}
