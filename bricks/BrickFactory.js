// BrickFactory.js - Factory pattern for creating different brick types

class BrickFactory {
    static createBrick(x, y, colorIndex) {
        switch (colorIndex) {
            case 0: // Red brick
                return new RedBrick(x, y);
            case 1: // Purple brick
                return new PurpleBrick(x, y);
            case 2: // Dark purple brick
                return new DarkPurpleBrick(x, y);
            case 3: // White brick
                return new WhiteBrick(x, y);
            case 4: // Golden brick (extra ball)
                return new GoldenBrick(x, y);
            case 5: // PowerUp brick (paddle width)
                return new PowerUpBrick(x, y);
            case 6: // Bomb brick
                return new BombBrick(x, y);
            default:
                console.warn(`Unknown brick type: ${colorIndex}, defaulting to PurpleBrick`);
                return new PurpleBrick(x, y);
        }
    }

    // Helper method to get brick type name
    static getBrickTypeName(colorIndex) {
        const typeNames = ['Red', 'Purple', 'DarkPurple', 'White', 'Golden', 'PowerUp', 'Bomb'];
        return typeNames[colorIndex] || 'Unknown';
    }
}
