class Enemy1 {

    static img = new Image();

    static {
        this.img.src = 'src/assets/enemy1/enemy1.png';
    }

    constructor(x, y) {
        this.width = 40 * 1.5;
        this.height = 64 * 1.5;
        this.x = x;
        this.y = y - this.height;
    }

    tick = function() {
        const player = handler.player;
        this.x -= player.velX;

        if (this.x + this.width <= 0) {
            handler.remove(this);
            return;
        }

        if (intersects(this, player)) {
            player.takeDamage();
        }
    }

    render = function(g) {
        g.strokeStyle = 'red';
        g.beginPath();
        g.rect(this.x, this.y, this.width, this.height);
        g.stroke();
        g.drawImage(Enemy1.img, this.x, this.y, this.width, this.height);
    }
}