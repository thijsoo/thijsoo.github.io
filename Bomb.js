// Bomb.js - Bomb power-up that bounces off paddle and explodes

class Bomb extends PowerUp {
    constructor(x, y) {
        super(x, y, 'bomb');
        this.explosionRadius = 80; // Radius of destruction
        this.hasBouncedOffPaddle = false;
        this.isExploding = false;
        this.explosionTimer = 0;
        this.explosionDuration = 30; // Half second explosion animation
        this.rotation = 0; // Track rotation for the bomb sprite

        // Make bomb bigger than regular power-ups
        this.width = 45;  // Increased from 20 to 30
        this.height = 45; // Increased from 20 to 30

        // Embed SVG as data URL to avoid CORS issues
        this.bombSprite = null;
        this.svgDataUrl = 'data:image/svg+xml;base64,' + btoa(`<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="498" height="456">
   <path fill="#7D529A" transform="matrix(1.00201 0 0 1.00201 357.862 177.64)" d="M70.055 -80.305C62.645 -82.405 12.855 -55.005 4.545 -44.165C-8.445 -27.225 -40.4338 2.51513 -52.266 31.45C-55.576 34.25 -57.0962 39.395 -55.3162 44.685C-41.5262 85.705 55.375 19.075 70.055 -80.305C70.055 -80.305 70.055 -80.305 70.055 -80.305Z"></path>
  <path fill="#5D237A" transform="matrix(1.00201 0 0 1.00201 425.292 80.5405)" d="M-1.19 27.9C2.99 23.16 4.83 14.49 6.73 8.67C8.81 2.28 9.78 -5.03 10.11 -11.69C10.44 -18.35 10.83 -25.95 8.86 -31.97C6.83 -38.15 3.61 -40.14 -0.63 -34.8C-6.78 -27.05 -6.26 -17.73 -6.26 -8.22C-6.26 -0.6 -5.64 7.06 -5.74 14.6C-5.86 23.23 -9.44 31.67 -10.83 40.14C-5.47 34.11 0.280001 27.54 2.21 19.42"></path>
  <path fill="#5D237A" transform="matrix(1.00201 0 0 1.00201 407.577 80.6607)" d="M8.58 26.08C14.31 15.16 11.15 -6.35 8.57 -18.67C7.02 -26.05 3.83 -41.05 -4.39 -29.97C-14.31 -16.6 -4.98 -3.58 -1.99 10.58C-1.14 14.59 -3.98 33.35 -1.49 35.49C4.98 41.05 13.31 17.09 11.98 12.54"></path>
  <path fill="#5D237A" transform="matrix(1.00201 0 0 1.00201 396.845 94.6287)" d="M8 15.53C9.73 11.53 7.72 5.56 6.86 1.04C5.91 -3.93 6.04 -12.63 2.93 -16.94C-0.18 -21.25 -2.97 -20.03 -5.14 -16.09C-10.6 -6.16 -4.07 15.71 5.19 21.25C8.9 16.89 10.6 10.82 9.13 4.8"></path>
  <path fill="#5D237A" transform="matrix(1.00201 0 0 1.00201 355.497 161.924)" d="M-4.945 -12.1C12.8266 -30.1062 26.765 -31.96 42.0587 -39.0488C58.825 -39.0488 69.2527 -41.3157 69.665 -53.32C64.725 -59.6 25.925 -57.26 -21.885 -29.04C-20.755 -24.52 -17.735 -20.57 -9.465 -13.79C-25.785 -7.27 -24.535 -31.96 -26.975 -27.34C-32.235 -17.37 -65.285 29.3011 -50.8156 56.5488C-42.2274 37.6957 -4.955 -12.1 -4.955 -12.1C-4.955 -12.1 -4.945 -12.1 -4.945 -12.1Z"></path>
  <path fill="#7D529A" transform="matrix(1.3917 -0.00673438 0.0565197 1.46122 207.321 265.604)" d="M-5.01 13.135C-14.67 15.135 -21.2 9.745 -15.36 -0.985C-11.06 -8.905 -1.65 -15.135 -2.19 -3.995C6.09 -6.065 21.2 -10.065 21.17 -2.615C21.15 1.465 4.97 11.065 -5.01 13.135C-5.01 13.135 -5.01 13.135 -5.01 13.135Z"></path>
  <path fill="#9C80B9" transform="matrix(1.58593 0.251212 -0.228015 1.43948 195.985 260.909)" d="M-5.01 13.135C-14.67 15.135 -21.2 9.745 -15.36 -0.985C-11.06 -8.905 -1.65 -15.135 -2.19 -3.995C6.09 -6.065 21.2 -10.065 21.17 -2.615C21.15 1.465 4.97 11.065 -5.01 13.135C-5.01 13.135 -5.01 13.135 -5.01 13.135Z"></path>
  <path fill="#754091" transform="matrix(1.58593 0.251212 -0.228015 1.43948 191.253 261.738)" d="M-6.86 5.255C-2.18 3.405 0.830004 1.525 6.86 3.215C1.59 1.705 1.21 -1.305 0.650004 -5.255C0.710004 -0.955 -0.0499963 1.725 -6.86 5.255C-6.86 5.255 -6.86 5.255 -6.86 5.255Z"></path>
  <path fill="#7D529A" transform="matrix(1.00201 0 0 1.00201 312.32 239.966)" d="M5.14998 -28.8C18.6019 -29.679 8.79997 -57.0853 35.47 -64.9352C59.73 -72.0752 86.98 -72.0952 104.09 -64.7852C120.46 -57.7852 148.59 3.83475 141.45 22.5848C133.26 44.0748 74.02 46.2547 54.968 43.0268C36.198 40.0138 -10.48 73.91 -46.64 64.98C-70.31 57.84 -93.02 34.6 -100.67 7.82002C-103.35 -1.55998 -130.29 -19.81 -139.96 -21.65C-147.59 -23.1 -104.32 -17.79 -104.32 -17.79C-104.32 -17.79 -126.53 -32.73 -114.51 -34.45C-110.34 -35.05 -75.28 -17.7 5.15999 -28.79C5.15999 -28.79 5.14998 -28.8 5.14998 -28.8Z"></path>
  <path fill="#FFC530" transform="matrix(1.00201 0 0 1.00201 407.406 232.003)" d="M-4.9 -20.18C1.35 -20.78 13.85 -8.57 15.04 -2.02C16.23 4.53 4.46 20.78 1.49 20.18C-1.48 19.58 -7.25 7.07 -14.13 -4.7C-16.23 -8.3 -11.15 -19.58 -4.9 -20.18Z"></path>
</svg>`);
        this.loadBombImage();
    }

    loadBombImage() {
        try {
            // Create PIXI sprite from base64 encoded SVG data URL
            this.bombSprite = PIXI.Sprite.from(this.svgDataUrl);
            this.bombSprite.anchor.set(0.5);
            this.bombSprite.width = this.width;
            this.bombSprite.height = this.height;

            console.log('Bomb SVG loaded successfully from data URL');
        } catch (error) {
            console.warn('Could not load bomb SVG from data URL:', error);
            this.bombSprite = null;
        }
    }

    createGraphics() {
        this.graphics = new PIXI.Graphics();
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;

        // Add the bomb sprite if it loaded successfully
        if (this.bombSprite) {
            this.graphics.addChild(this.bombSprite);
        }
    }

    updateGraphics() {
        this.graphics.clear();

        if (this.isExploding) {
            // Draw explosion effect
            const progress = this.explosionTimer / this.explosionDuration;
            const maxRadius = this.explosionRadius;
            const currentRadius = maxRadius * progress;
            const alpha = 1 - progress;

            // Outer explosion ring
            this.graphics.beginFill(COLORS.ORANGE, alpha * 0.8);
            this.graphics.drawCircle(0, 0, currentRadius);
            this.graphics.endFill();

            // Inner explosion core
            this.graphics.beginFill(COLORS.YELLOW, alpha);
            this.graphics.drawCircle(0, 0, currentRadius * 0.6);
            this.graphics.endFill();

            // White flash at center
            this.graphics.beginFill(COLORS.WHITE, alpha * 0.9);
            this.graphics.drawCircle(0, 0, currentRadius * 0.3);
            this.graphics.endFill();
        } else {
            // Show the SVG sprite if loaded, otherwise use fallback
            if (this.bombSprite) {
                // Apply rotation to the sprite
                this.bombSprite.rotation = this.rotation;

                // Re-add the sprite if it was cleared
                if (!this.graphics.children.includes(this.bombSprite)) {
                    this.graphics.addChild(this.bombSprite);
                }
            } else {
                // Use fallback drawn bomb if SVG failed to load
                // Apply rotation to the entire graphics context for fallback
                this.graphics.rotation = this.rotation;
                this.drawFallbackBomb();
            }

            // Add glowing trail effect if moving upward after paddle bounce
            if (this.hasBouncedOffPaddle) {
                this.graphics.beginFill(COLORS.ORANGE, 0.3);
                this.graphics.drawCircle(0, 0, this.width / 2 + 4);
                this.graphics.endFill();
            }
        }
    }

    drawFallbackBomb() {
        // Draw a detailed bomb graphic as fallback
        const centerX = 0;
        const centerY = 0;

        // Draw bomb shadow first for depth
        this.graphics.beginFill(COLORS.BLACK, 0.3);
        this.graphics.drawCircle(centerX + 1, centerY + 3, 9);
        this.graphics.endFill();

        // Draw bomb body (large black sphere)
        this.graphics.beginFill(COLORS.BLACK);
        this.graphics.drawCircle(centerX, centerY + 2, 9);
        this.graphics.endFill();

        // Draw main highlight (for 3D effect)
        this.graphics.beginFill(COLORS.WHITE, 0.7);
        this.graphics.drawCircle(centerX - 3, centerY - 1, 3);
        this.graphics.endFill();

        // Draw secondary highlight
        this.graphics.beginFill(COLORS.WHITE, 0.4);
        this.graphics.drawCircle(centerX - 4, centerY, 1.5);
        this.graphics.endFill();

        // Draw bomb fuse (thick yellow fuse)
        this.graphics.beginFill(COLORS.YELLOW);
        this.graphics.drawRoundedRect(centerX - 1.5, centerY - 8, 3, 10, 1);
        this.graphics.endFill();

        // Draw fuse highlight for realism
        this.graphics.beginFill(COLORS.WHITE, 0.6);
        this.graphics.drawRoundedRect(centerX - 0.5, centerY - 8, 1, 10, 0.5);
        this.graphics.endFill();

        // Draw animated spark at top of fuse (pulsing effect)
        const time = Date.now() * 0.01;
        const sparkSize = 2.5 + Math.sin(time) * 0.5;
        this.graphics.beginFill(COLORS.RED);
        this.graphics.drawCircle(centerX, centerY - 9, sparkSize);
        this.graphics.endFill();

        // Draw spark glow effect
        this.graphics.beginFill(COLORS.ORANGE, 0.6);
        this.graphics.drawCircle(centerX, centerY - 9, sparkSize + 1);
        this.graphics.endFill();

        // Add overall bomb glow
        this.graphics.beginFill(COLORS.ORANGE, 0.2);
        this.graphics.drawCircle(centerX, centerY, 14);
        this.graphics.endFill();
    }

    update(delta) {
        if (!this.isActive) return;

        if (this.isExploding) {
            this.explosionTimer += delta;
            if (this.explosionTimer >= this.explosionDuration) {
                this.isActive = false;
            }
            this.updateGraphics();
            return;
        }

        // Move the bomb
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;

        // Remove if it falls off screen (only if hasn't bounced yet)
        if (!this.hasBouncedOffPaddle && this.position.y > 600) {
            this.isActive = false;
        }

        // If moving upward after paddle bounce, explode when it reaches target height
        if (this.hasBouncedOffPaddle && this.velocity.y < 0 && this.position.y <= 200) {
            this.explode();
        }

        this.updateGraphics();
    }

    checkPaddleCollision(paddle) {
        if (this.collected || !this.isActive || this.hasBouncedOffPaddle) return false;

        // Simple AABB collision detection
        return (this.position.x < paddle.position.x + paddle.width &&
                this.position.x + this.width > paddle.position.x &&
                this.position.y < paddle.position.y + paddle.height &&
                this.position.y + this.height > paddle.position.y);
    }

    bounceOffPaddle(paddle) {
        this.hasBouncedOffPaddle = true;

        // Calculate bounce angle based on paddle hit position (similar to ball)
        const paddleCenter = paddle.getCenterX();
        const hitPosition = (this.position.x - paddleCenter) / (paddle.width / 2);
        const clampedHitPosition = Math.max(-0.8, Math.min(0.8, hitPosition));

        // Set upward velocity with slight horizontal component - increased speed from 6 to 9
        const speed = 9;
        const angle = -Math.PI / 2 + (clampedHitPosition * Math.PI / 6); // Up to 30 degrees left/right

        this.velocity.x = Math.cos(angle) * speed;
        this.velocity.y = Math.sin(angle) * speed;

        // Apply -45 degree rotation when flying back up
        this.rotation = -Math.PI / 4; // -45 degrees in radians

        console.log('Bomb bounced off paddle and is now flying upward!');
    }

    explode() {
        this.isExploding = true;
        this.explosionTimer = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;

        console.log(`Bomb exploding at (${this.position.x}, ${this.position.y}) with radius ${this.explosionRadius}`);
    }

    getExplosionRadius() {
        return this.explosionRadius;
    }

    collect() {
        // Override - bombs don't get "collected" in the traditional sense
        // They bounce off the paddle instead
    }
}
