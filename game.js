// Yoast SEO Brick Breaker Game
// Main entry point - simplified with modular structure

class YoastBrickBreaker {
    constructor() {
        this.gameManager = new GameManager();

        // Make game manager globally accessible for debugging
        window.gameManager = this.gameManager;

        console.log('Yoast SEO Brick Breaker initialized with modular structure!');
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    const game = new YoastBrickBreaker();

    // Make game globally accessible for debugging
    window.game = game;
});
