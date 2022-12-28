class Platform {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 450;
        this.height = 100;
        this.behaviors = ['platform'];
    }

    tick = function() {
        this.x -= handler.player.velX;

        if (this.x + this.width <= 0) {
            var x = handler.selectByBehavior('platform').slice(-1)[0].x;
            var y = handler.selectByBehavior('platform').slice(-1)[0].y;

            handler.remove(this);

            var random = Math.random();
            if (random >= 0.75) {
                handler.add(new Platform(x + this.width + 400, y));
            } else if (random >= 0.5) {
                handler.add(new Platform(x + this.width + 300, clamp(y - 100, 300, 500)));
            // } else if (random >= 0.25) {
            //     handler.add(new Platform(x + this.width + 600, clamp(y - 100, 300, 500)));
            } else {
                handler.add(new Platform(x + this.width, 500));
            }
        }
    }

    render = function(g) {
        g.fillStyle = 'green';
        g.fillRect(this.x, this.y, this.width, this.height);

        g.strokeStyle = 'black';
        g.beginPath();
        g.rect(this.x, this.y, this.width, this.height);
        g.stroke();
    }
}