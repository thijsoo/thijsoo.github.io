// ParticleManager.js - Handles visual effects like particles and glows

class ParticleManager {
    constructor(app) {
        this.app = app;
        this.particles = [];
        this.glowEffects = [];
        this.particleContainer = new PIXI.Container();

        // Add particle container to stage
        this.app.stage.addChild(this.particleContainer);

        console.log('ParticleManager initialized');
    }

    update(delta) {
        // Update all particles
        this.particles = this.particles.filter(particle => {
            particle.update(delta);

            if (particle.isDead()) {
                this.particleContainer.removeChild(particle.graphics);
                particle.destroy();
                return false;
            }
            return true;
        });

        // Update glow effects
        this.glowEffects = this.glowEffects.filter(glow => {
            glow.update(delta);

            if (glow.isDead()) {
                this.particleContainer.removeChild(glow.graphics);
                glow.destroy();
                return false;
            }
            return true;
        });
    }

    createBrickHitParticles(x, y, color) {
        const particleCount = 12; // More particles for better effect

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = Math.random() * 120 + 80;

            const particle = new Particle(x, y, {
                color: color,
                velocity: {
                    x: Math.cos(angle) * speed + (Math.random() - 0.5) * 50,
                    y: Math.sin(angle) * speed - Math.random() * 100
                },
                size: Math.random() * 5 + 3,
                life: Math.random() * 0.8 + 0.4,
                gravity: 200,
                sparkle: true
            });

            this.particles.push(particle);
            this.particleContainer.addChild(particle.graphics);
        }

        // Add extra sparkle particles
        for (let i = 0; i < 6; i++) {
            const sparkle = new Particle(x, y, {
                color: COLORS.WHITE,
                velocity: {
                    x: (Math.random() - 0.5) * 150,
                    y: (Math.random() - 0.5) * 150 - 50
                },
                size: Math.random() * 3 + 1,
                life: Math.random() * 0.4 + 0.2,
                gravity: 100,
                sparkle: true,
                fadeOut: true
            });

            this.particles.push(sparkle);
            this.particleContainer.addChild(sparkle.graphics);
        }
    }

    createPaddleHitGlow(x, y) {
        // Create multiple layered glow effects
        for (let i = 0; i < 3; i++) {
            const glow = new GlowEffect(x, y, {
                color: COLORS.GREEN,
                maxSize: 50 - (i * 10),
                duration: 0.4 + (i * 0.1),
                intensity: 0.8 - (i * 0.2)
            });

            this.glowEffects.push(glow);
            this.particleContainer.addChild(glow.graphics);
        }

        // Add radial burst particles
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const particle = new Particle(x, y, {
                color: COLORS.GREEN,
                velocity: {
                    x: Math.cos(angle) * 80,
                    y: Math.sin(angle) * 80
                },
                size: 2,
                life: 0.3,
                gravity: 0,
                fadeOut: true
            });

            this.particles.push(particle);
            this.particleContainer.addChild(particle.graphics);
        }
    }

    createBallTrail(x, y) {
        const trail = new Particle(x, y, {
            color: COLORS.WHITE,
            velocity: { x: 0, y: 0 },
            size: 3,
            life: 0.2,
            gravity: 0,
            fadeOut: true
        });

        this.particles.push(trail);
        this.particleContainer.addChild(trail.graphics);
    }

    createLevelCompleteEffect(centerX, centerY) {
        // Create spectacular fireworks-like effect
        const particleCount = 40;
        const colors = [COLORS.GREEN, COLORS.PURPLE, COLORS.WHITE];

        // Multiple waves of particles
        for (let wave = 0; wave < 3; wave++) {
            setTimeout(() => {
                for (let i = 0; i < particleCount; i++) {
                    const angle = (i / particleCount) * Math.PI * 2;
                    const speed = Math.random() * 200 + 150;

                    const particle = new Particle(centerX, centerY, {
                        color: colors[i % colors.length],
                        velocity: {
                            x: Math.cos(angle) * speed,
                            y: Math.sin(angle) * speed - 50
                        },
                        size: Math.random() * 8 + 4,
                        life: Math.random() * 1.5 + 1,
                        gravity: 100,
                        sparkle: true
                    });

                    this.particles.push(particle);
                    this.particleContainer.addChild(particle.graphics);
                }
            }, wave * 300);
        }

        // Central explosion glow
        const centralGlow = new GlowEffect(centerX, centerY, {
            color: COLORS.GREEN,
            maxSize: 100,
            duration: 2,
            intensity: 1
        });

        this.glowEffects.push(centralGlow);
        this.particleContainer.addChild(centralGlow.graphics);
    }

    destroy() {
        // Clean up all particles and effects
        this.particles.forEach(particle => particle.destroy());
        this.glowEffects.forEach(glow => glow.destroy());

        this.particles = [];
        this.glowEffects = [];

        if (this.particleContainer) {
            this.app.stage.removeChild(this.particleContainer);
            this.particleContainer.destroy({ children: true });
        }
    }
}

class Particle {
    constructor(x, y, options = {}) {
        this.position = { x, y };
        this.velocity = options.velocity || { x: 0, y: 0 };
        this.color = options.color || COLORS.WHITE;
        this.size = options.size || 3;
        this.life = options.life || 1;
        this.maxLife = this.life;
        this.gravity = options.gravity || 0;
        this.fadeOut = options.fadeOut || true;

        this.createGraphics();
    }

    createGraphics() {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.size);
        this.graphics.endFill();

        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;
    }

    update(delta) {
        // Update position
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;

        // Apply gravity
        this.velocity.y += this.gravity * delta;

        // Update life
        this.life -= delta;

        // Update graphics
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;

        // Fade out effect
        if (this.fadeOut) {
            const alpha = this.life / this.maxLife;
            this.graphics.alpha = Math.max(0, alpha);
        }
    }

    isDead() {
        return this.life <= 0;
    }

    destroy() {
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }
    }
}

class GlowEffect {
    constructor(x, y, options = {}) {
        this.position = { x, y };
        this.color = options.color || COLORS.WHITE;
        this.maxSize = options.maxSize || 30;
        this.duration = options.duration || 0.5;
        this.intensity = options.intensity || 0.5;
        this.time = 0;

        this.createGraphics();
    }

    createGraphics() {
        this.graphics = new PIXI.Graphics();
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;
        this.updateGlow();
    }

    updateGlow() {
        this.graphics.clear();

        // Calculate current size and alpha based on time
        const progress = this.time / this.duration;
        const size = this.maxSize * Math.sin(progress * Math.PI);
        const alpha = this.intensity * Math.sin(progress * Math.PI);

        // Create glow effect with multiple circles
        for (let i = 3; i >= 1; i--) {
            const circleSize = size * (i / 3);
            const circleAlpha = alpha * (1 / i) * 0.3;

            this.graphics.beginFill(this.color, circleAlpha);
            this.graphics.drawCircle(0, 0, circleSize);
            this.graphics.endFill();
        }
    }

    update(delta) {
        this.time += delta;
        this.updateGlow();
    }

    isDead() {
        return this.time >= this.duration;
    }

    destroy() {
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }
    }
}
