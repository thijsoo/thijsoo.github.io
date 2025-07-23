// WhiteBrick.js - Standard white brick (single hit, low points)

class WhiteBrick extends BaseBrick {
    constructor(x, y) {
        super(x, y, COLORS.WHITE, 5, 1); // White color, 5 points, 1 hit to destroy
    }
}
