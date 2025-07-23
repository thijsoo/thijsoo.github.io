// InputManager.js - Handles all keyboard input and input state

class InputManager {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            space: false
        };

        // Callbacks for specific events
        this.onSpacePressed = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });

        window.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
    }

    handleKeyDown(event) {
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                if (!this.keys.space && this.onSpacePressed) {
                    this.onSpacePressed();
                }
                this.keys.space = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                event.preventDefault();
                this.keys.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                event.preventDefault();
                this.keys.right = true;
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.keys.space = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                event.preventDefault();
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                event.preventDefault();
                this.keys.right = false;
                break;
        }
    }

    isLeftPressed() {
        return this.keys.left;
    }

    isRightPressed() {
        return this.keys.right;
    }

    isSpacePressed() {
        return this.keys.space;
    }
}
