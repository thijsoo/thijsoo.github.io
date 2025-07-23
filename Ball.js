// Ball.js - Handles ball creation, movement, and physics

// Ball constants
const BALL_RADIUS = 8;
const BALL_SPEED = 7; // Increased from 5 to 7
const BALL_START_ANGLE = -Math.PI / 3;

class Ball extends GameObject {
    constructor(gameWidth, gameHeight) {
        // Call parent constructor with initial position (center of game)
        super(gameWidth / 2, gameHeight / 2);

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.radius = BALL_RADIUS;
        this.speed = BALL_SPEED;

        // Ball state
        this.isLaunched = false;
        this.velocity = { x: 0, y: 0 };

        this.createGraphics();
        console.log('Ball created at position:', this.position.x, this.position.y);
    }

    createGraphics() {
        this.graphics = new PIXI.Graphics();
        this.updateBallGraphics();

        // Set initial position
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;
    }

    updateBallGraphics() {
        this.graphics.clear();

        // Create a 3D sphere effect with multiple layers
        // Shadow/depth
        this.graphics.beginFill(COLORS.BLACK, 0.3);
        this.graphics.drawCircle(1, 1, this.radius);
        this.graphics.endFill();

        // Main ball body
        this.graphics.beginFill(COLORS.WHITE);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();

        // Gradient highlight (top-left)
        this.graphics.beginFill(0xFFFFFF, 0.8);
        this.graphics.drawCircle(-2, -2, this.radius * 0.6);
        this.graphics.endFill();

        // Bright highlight spot
        this.graphics.beginFill(0xFFFFFF, 0.9);
        this.graphics.drawCircle(-3, -3, this.radius * 0.3);
        this.graphics.endFill();

        // Green glowing border
        this.graphics.lineStyle(2, COLORS.GREEN, 0.8);
        this.graphics.drawCircle(0, 0, this.radius);

        // Add subtle outer glow
        this.graphics.lineStyle(1, COLORS.GREEN, 0.3);
        this.graphics.drawCircle(0, 0, this.radius + 2);
    }

    update(delta) {
        if (!this.isActive || !this.isLaunched) return;

        this.updatePosition(delta);
        this.handleWallCollisions();
    }

    updatePosition(delta) {
        const newX = this.position.x + (this.velocity.x * delta);
        const newY = this.position.y + (this.velocity.y * delta);
        this.setPosition(newX, newY);
    }

    handleWallCollisions() {
        let newX = this.position.x;
        let newY = this.position.y;
        let velocityChanged = false;

        // Left wall collision
        if (newX - this.radius <= 0) {
            newX = this.radius;
            this.velocity.x = -this.velocity.x;
            velocityChanged = true;
        }

        // Right wall collision
        if (newX + this.radius >= this.gameWidth) {
            newX = this.gameWidth - this.radius;
            this.velocity.x = -this.velocity.x;
            velocityChanged = true;
        }

        // Top wall collision
        if (newY - this.radius <= 0) {
            newY = this.radius;
            this.velocity.y = -this.velocity.y;
            velocityChanged = true;
        }

        if (velocityChanged) {
            this.setPosition(newX, newY);
            // Play wall bounce sound - need to access sound manager through global reference
            if (window.game && window.game.gameManager && window.game.gameManager.soundManager) {
                window.game.gameManager.soundManager.playWallBounce();
            }
        }
    }

    launch(angle = BALL_START_ANGLE) {
        this.isLaunched = true;
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;

        // Play ball launch sound
        if (window.game && window.game.gameManager && window.game.gameManager.soundManager) {
            window.game.gameManager.soundManager.playBallLaunch();
        }

        console.log('Ball launched with velocity:', this.velocity);
    }

    reset() {
        this.isLaunched = false;
        this.velocity = { x: 0, y: 0 };
        // Don't set position here - let the GameManager position it on the paddle
        // The GameManager will call positionOnPaddle() after reset
    }

    positionOnPaddle(paddle) {
        const paddleBounds = paddle.getBounds();
        const newX = paddle.getCenterX();
        const newY = paddleBounds.top - this.radius - 2;
        this.setPosition(newX, newY);
    }

    getBounds() {
        return {
            left: this.position.x - this.radius,
            right: this.position.x + this.radius,
            top: this.position.y - this.radius,
            bottom: this.position.y + this.radius,
            centerX: this.position.x,
            centerY: this.position.y,
            radius: this.radius
        };
    }

    checkBottomBoundary() {
        return this.position.y - this.radius > this.gameHeight;
    }

    checkPaddleCollision(paddle) {
        if (!this.isLaunched || !this.isActive) return false;

        const ballBounds = this.getBounds();
        const paddleBounds = paddle.getBounds();

        if (this.velocity.y > 0 &&
            ballBounds.bottom >= paddleBounds.top &&
            ballBounds.top <= paddleBounds.bottom &&
            ballBounds.right >= paddleBounds.left &&
            ballBounds.left <= paddleBounds.right) {

            this.handlePaddleBounce(paddle);
            console.log('Paddle collision detected!');
            return true;
        }

        return false;
    }

    handlePaddleBounce(paddle) {
        const paddleCenter = paddle.getCenterX();
        const hitPosition = (this.position.x - paddleCenter) / (paddle.width / 2);

        // Clamp hit position to prevent extreme angles
        const clampedHitPosition = Math.max(-0.8, Math.min(0.8, hitPosition));

        // Calculate new angle based on hit position
        const maxAngle = Math.PI / 3; // 60 degrees max
        const angle = -Math.PI / 2 + (clampedHitPosition * maxAngle);

        // Set new velocity maintaining speed
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;

        // Ensure ball is above paddle
        this.setPosition(this.position.x, this.position.y - 2);
    }

    checkBrickCollision(brick) {
        if (!this.isLaunched || !this.isActive) return false;
        return this.checkCollision(brick);
    }

    handleBrickBounce(brick) {
        const ballBounds = this.getBounds();
        const brickBounds = brick.getBounds();

        const ballCenterX = ballBounds.centerX;
        const ballCenterY = ballBounds.centerY;
        const brickCenterX = (brickBounds.left + brickBounds.right) / 2;
        const brickCenterY = (brickBounds.top + brickBounds.bottom) / 2;

        const deltaX = ballCenterX - brickCenterX;
        const deltaY = ballCenterY - brickCenterY;

        // Calculate overlap amounts to determine primary collision axis
        const overlapX = (ballBounds.radius + brickBounds.width / 2) - Math.abs(deltaX);
        const overlapY = (ballBounds.radius + brickBounds.height / 2) - Math.abs(deltaY);

        // Use the smaller overlap to determine bounce direction (more accurate)
        if (overlapX < overlapY) {
            // Horizontal collision (left or right side of brick)
            this.velocity.x = -this.velocity.x;
            // Push ball out of brick horizontally
            const pushDirection = deltaX > 0 ? 1 : -1;
            const newX = brickCenterX + pushDirection * (brickBounds.width / 2 + this.radius + 2);
            this.setPosition(newX, this.position.y);
        } else {
            // Vertical collision (top or bottom of brick)
            this.velocity.y = -this.velocity.y;
            // Push ball out of brick vertically
            const pushDirection = deltaY > 0 ? 1 : -1;
            const newY = brickCenterY + pushDirection * (brickBounds.height / 2 + this.radius + 2);
            this.setPosition(this.position.x, newY);
        }

        console.log('Brick collision handled with improved physics!');
    }

    getVelocity() {
        return { ...this.velocity };
    }

    setVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }
}
