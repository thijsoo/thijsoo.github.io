// RedBrick.js - Red brick that changes to green when damaged

class RedBrick extends BaseBrick {
    constructor(x, y) {
        super(x, y, COLORS.RED, 10, 2); // Red color, 10 points, 2 hits to destroy
    }

    onDamage() {
        // Red brick changes to green when damaged
        this.color = COLORS.GREEN;
        console.log('Red brick hit once! Changed to green. Next hit will destroy it.');
    }
}
