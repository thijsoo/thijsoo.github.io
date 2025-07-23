// PurpleBrick.js - Standard purple brick (single hit)

class PurpleBrick extends BaseBrick {
    constructor(x, y) {
        super(x, y, COLORS.PURPLE, 20, 1); // Purple color, 20 points, 1 hit to destroy
    }
}
