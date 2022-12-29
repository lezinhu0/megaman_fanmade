class Projectile {
    constructor(x, y, facingRight) {
        this.x = x;
        this.y = y;
        this.width = 14;
        this.height = 14;
        this.velX = facingRight ? 40 : -40;
        this.velY = 0;
        this.type = 'projectile';
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