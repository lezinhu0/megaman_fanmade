class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;
        this.velX = 40;
        this.velY = 0;
    }

    tick = function() {
        this.x += this.velX;

        if (this.x >= _WIDTH) {
            handler.remove(this);
        }
    }

    render = function(g) {  
        g.fillStyle = 'black';
        g.fillRect(this.x, this.y, this.width, this.height);
    }
}