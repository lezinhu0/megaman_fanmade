class EventArea {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    tick = function() {
        const player = handler.player;

        if (gamestate == 'INFINITE_RUNNER') {
            this.x -= handler.player.velX;
        }

        if (this.x + this.width <= 0) {
            gamestate = 'BOSS_BATTLE';
            handler.remove(this);
            holder = new Mario(650, 500);
            handler.add(holder);
        }
    }

    render = function(g) {
        // g.fillStyle = 'yellow';
        // g.fillRect(this.x, this.y, this.width, this.height);
    }

}