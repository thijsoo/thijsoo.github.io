// SoundManager.js - Handles all sound effects and audio

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.masterVolume = 0.7;
        this.soundEnabled = true;

        // Background music properties
        this.backgroundMusic = null;
        this.musicVolume = 0.3;
        this.musicEnabled = true;
        this.musicGainNode = null;

        this.initializeAudioContext();
        this.createSounds();
        this.loadBackgroundMusic();

        console.log('SoundManager initialized');
    }

    initializeAudioContext() {
        try {
            // Create Web Audio API context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create master gain node for volume control
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);

        } catch (error) {
            console.warn('Web Audio API not supported, sound will be disabled:', error);
            this.soundEnabled = false;
        }
    }

    loadBackgroundMusic() {
        if (!this.soundEnabled) return;

        // Create HTML audio element for background music
        this.backgroundMusic = new Audio('music/chill-gaming-vibes.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.musicVolume;
        this.backgroundMusic.preload = 'auto';

        // Handle loading events
        this.backgroundMusic.addEventListener('canplaythrough', () => {
            console.log('Background music loaded successfully');
        });

        this.backgroundMusic.addEventListener('error', (e) => {
            console.warn('Failed to load background music:', e);
            this.backgroundMusic = null;
        });

        console.log('Loading background music: chill-gaming-vibes.mp3');
    }

    createSounds() {
        if (!this.soundEnabled) return;

        // Create different sounds using oscillators
        this.sounds = {
            paddleHit: this.createPaddleHitSound(),
            brickHit: this.createBrickHitSound(),
            brickDamage: this.createBrickDamageSound(),
            wallBounce: this.createWallBounceSound(),
            ballLost: this.createBallLostSound(),
            gameOver: this.createGameOverSound(),
            levelComplete: this.createLevelCompleteSound(),
            ballLaunch: this.createBallLaunchSound()
        };

        console.log('Sound effects created');
    }

    createPaddleHitSound() {
        return () => {
            if (!this.soundEnabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            // Paddle hit sound - deep thump
            oscillator.frequency.setValueAtTime(120, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        };
    }

    createBrickHitSound() {
        return () => {
            if (!this.soundEnabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            // Brick hit sound - crisp pop
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    createBrickDamageSound() {
        return () => {
            if (!this.soundEnabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            // Brick damage sound - short buzz
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    createWallBounceSound() {
        return () => {
            if (!this.soundEnabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            // Wall bounce sound - quick bleep
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);

            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        };
    }

    createBallLostSound() {
        return () => {
            if (!this.soundEnabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            // Ball lost sound - descending tone
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);

            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        };
    }

    createGameOverSound() {
        return () => {
            if (!this.soundEnabled) return;

            // Game over - sequence of descending tones
            const frequencies = [440, 370, 311, 262];
            const duration = 0.3;

            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(this.masterGain);

                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

                    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + duration);
                }, index * 250);
            });
        };
    }

    createLevelCompleteSound() {
        return () => {
            if (!this.soundEnabled) return;

            // Level complete - ascending victory melody
            const frequencies = [262, 330, 392, 523];
            const duration = 0.2;

            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(this.masterGain);

                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

                    gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + duration);
                }, index * 150);
            });
        };
    }

    createBallLaunchSound() {
        return () => {
            if (!this.soundEnabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            // Ball launch sound - quick ascending chirp
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    // Public methods to play sounds
    playPaddleHit() {
        this.sounds.paddleHit?.();
    }

    playBrickHit() {
        this.sounds.brickHit?.();
    }

    playBrickDamage() {
        this.sounds.brickDamage?.();
    }

    playWallBounce() {
        this.sounds.wallBounce?.();
    }

    playBallLost() {
        this.sounds.ballLost?.();
    }

    playGameOver() {
        this.sounds.gameOver?.();
    }

    playLevelComplete() {
        this.sounds.levelComplete?.();
    }

    playBallLaunch() {
        this.sounds.ballLaunch?.();
    }

    // Volume and settings control
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }

    // Background music controls
    playBackgroundMusic() {
        if (this.backgroundMusic && this.musicEnabled && this.soundEnabled) {
            this.backgroundMusic.currentTime = 0; // Start from beginning
            this.backgroundMusic.play().catch(e => {
                console.warn('Could not play background music:', e);
            });
            console.log('Background music started');
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            console.log('Background music paused');
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            console.log('Background music stopped');
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.playBackgroundMusic();
        } else {
            this.pauseBackgroundMusic();
        }
        console.log(`Background music ${this.musicEnabled ? 'enabled' : 'disabled'}`);
        return this.musicEnabled;
    }

    isMusicEnabled() {
        return this.musicEnabled;
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (!this.soundEnabled) {
            this.pauseBackgroundMusic();
        } else if (this.musicEnabled) {
            this.playBackgroundMusic();
        }
        console.log(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`);
        return this.soundEnabled;
    }

    isSoundEnabled() {
        return this.soundEnabled;
    }
}
