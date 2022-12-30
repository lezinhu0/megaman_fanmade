class SpiritBomb {

    static animation;

    static {
        var animation = {
            repeat: true,
            imgs: []
        };

        for (var i = 0; i <= 24; i++) {
            var img = new Image();
            img.src = '../Assets/fx/glow-circle/24/2400' + (i < 10 ? '0' + i : i) + '.png';
            img.duration = 1;
            animation.imgs.push(img);
        }

        SpiritBomb.animation = animation;

    }

    constructor(x, y) {
        this.width = -30;
        this.height = -30;
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        this.velX = 0;
        this.velY = 0;
        this.phase = 0;
        this.hittedPlayer = false;
        this.animation = SpiritBomb.animation;
        this.currentFrame = 0;
        this.frameDuration = this.animation.imgs[0].duration;
    }

    updateAnimations = function() {
        this.frameDuration--;

        if (this.frameDuration <= 0) {
            this.currentFrame++;

            if (this.currentFrame >= this.animation.imgs.length) {
                if (this.animation.repeat) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.animation.imgs.length - 1;
                }
            }

            this.frameDuration = this.animation.imgs[this.currentFrame].duration;
        }
    }

    tick = function() {
        this.updateAnimations();

        const player = handler.player;

        if (this.phase == 0) {
            var centerX = this.x + this.width / 2;
            this.width = clamp(this.width + 1, 0, 100);
            this.x = centerX - this.width / 2;
    
            var centerY = this.y + this.height / 2;
            this.height = clamp(this.height + 1, 0, 100);
            this.y = centerY - this.height / 2;

            if (this.width == 100 && this.height == 100) {
                this.phase = 1;
            }
        }

        if (this.phase == 1) {
            var speed = 10;
            const player = handler.player;

            var dx = (this.x + this.width / 2) - (player.x + player.width / 2);
            var dy = (this.y + this.height / 2) - (player.y + player.height / 2);

            this.velX = -speed * (dx / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
            this.velY = -speed * (dy / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));

            this.phase = 2;
        }

        if (this.phase == 2) {
            this.x += this.velX;
            this.y += this.velY;

            if (this.x > _WIDTH || this.x + this.width < 0) {
                handler.remove(this);
                return;
            }

            if (this.y > _HEIGHT || this.y + this.height < 0) {
                handler.remove(this);
                return;
            }

            if (!this.hittedPlayer && intersects(this, player)) {
                this.hittedPlayer = true;
                player.takeDamage();
            }
        }
    }

    render = function(g) {
        var addSize = this.width * 2;
        g.drawImage(this.animation.imgs[this.currentFrame], this.x - addSize / 2, this.y - addSize / 2, this.width + addSize, this.height + addSize);
    }
}