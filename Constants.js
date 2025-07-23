// Constants.js - Shared constants for the entire game

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Yoast brand colors
const COLORS = {
    GREEN: 0x77B227,     // #77B227 - Yoast green
    RED: 0xE50000,       // #E50000 - Red brick color
    PURPLE: 0xa61e69,    // #a61e69
    DARK_PURPLE: 0x760088,
    WHITE: 0xFFFFFF,     // #FFFFFF
    BLACK: 0x000000,     // #000000
    LIGHT_BLUE: 0x73D7EE,  // #73D7EE - Light blue
    DARK_GREEN: 0x028121,  // #028121 - Dark green
    BLUE: 0x004CFF,        // #004CFF - Blue
    ORANGE: 0xFF8D00,      // #FF8D00 - Orange
    BROWN: 0x613A15,       // #613A15 - Brown
    PINK: 0xFFAFC7,        // #FFAFC7 - Pink
    YELLOW: 0xFFEE00,      // #FFEE00 - Yellow
    GOLD: 0xFFD700         // #FFD700 - Gold for extra ball brick
};

// Game states
const GAME_STATES = {
    START: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};

// Stage definitions
const STAGES = [
    {
        // Stage 1: Mixed brick types - easier introduction
        layout: [
            [4, 2, 4, 2, 4, 2, 4], // White and purple alternating
            [2, 1, 2, 6, 2, 1, 2], // Purple and red alternating with PowerUp brick
            [1, 3, 1, 7, 1, 3, 1], // Red and dark purple alternating with Bomb brick
            [4, 4, 2, 5, 7, 7, 4]  // White edges with purple center and golden extra ball brick
        ]
    },
    {
        // Stage 2: More challenging with harder bricks and gaps
        layout: [
            [3, 3, 1, 5, 1, 3, 3], // Dark purple corners, red center with golden extra ball brick
            [1, 2, 4, 6, 4, 2, 1], // Red edges with mixed center and PowerUp brick
            [0, 0, 0, 7, 0, 0, 0], // Empty row with Bomb brick in center
            [2, 3, 2, 6, 2, 3, 2], // Purple and dark purple alternating with PowerUp brick
            [3, 1, 3, 7, 3, 1, 3]  // Dark purple and red alternating with Bomb brick
        ]
    }
];
