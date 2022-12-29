class Enemy2 {

    static animation;

    static {
        Enemy2.animation = {
            repeat: true,
            imgs: []
        }

        var img = new Image();
        img.src = 'src/assets/enemy2/enemy2-1.png';
        img.duration = 40;
        Enemy2.animation.imgs.push(img);

        img = new Image();
        img.src = 'src/assets/enemy2/enemy2-2.png';
        img.duration = 40;
        Enemy2.animation.imgs.push(img);
    }

    constructor(x, y) {
        this.width = 35;
        this.height = 35;
        this.x = x;
        this.y = y - this.height;
        this.animation = Enemy2.animation;
        this.frameDuration = this.animation.imgs[0].duration;
        this.currentFrame = 0;
    }

    updateAnimation = function() {
        this.frameDuration--;

        if (this.frameDuration <= 0) {
            this.currentFrame++;

            if (this.currentFrame >= this.animation.imgs.length) {
                if (this.animation.repeat) {
                    this.currentFrame = 0;
                }
            }

            this.frameDuration = this.animation.imgs[this.currentFrame].duration;
        }
    }

    tick = function() {
        this.updateAnimation();

        const player = handler.player;
        if (gamestate == 'INFINITE_RUNNER') {
            this.x -= player.velX;
        }

        if (this.x + this.width <= 0) {
            handler.remove(this);
        }

        if (intersects(this, player)) {
            player.takeDamage();
        }

        handler.selectByType('projectile').forEach(obj => {
            if (intersects(this, obj)) {
                handler.remove(this);
                handler.remove(obj);
                return;
            }
        });
        
    }

    render = function(g) {
        g.drawImage(this.animation.imgs[this.currentFrame], this.x, this.y, this.width, this.height);
    }
}