class Projectile {

    static animation = {
        repeat: true,
        imgs: []
    }

    static {
        for (var i = 1; i <= 4; i++) {
            var img = new Image();
            img.src = 'src/assets/megaman/projectile/projectile-' + i + '.png';
            img.duration = 3;
            Projectile.animation.imgs.push(img);
        }
    }

    constructor(x, y, facingRight) {
        this.width = 80;
        this.height = 45;
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        this.speed = 20;
        this.velX = facingRight ? this.speed : -this.speed;
        this.velY = 0;
        this.type = 'projectile';
        this.facingRight = facingRight;
        this.animation = Projectile.animation;
        this.currentFrame = 0;
        this.frameDuration = this.animation.imgs[this.currentFrame].duration;
    }

    updateAnimation = function() {
        this.frameDuration--;

        if (this.frameDuration <= 0) {
            this.currentFrame++;
            
            if (this.currentFrame >= this.animation.imgs.length) {
                if (this.animation.repeat) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.animation.imgs.length - 1
                }
            }
            this.frameDuration = this.animation.imgs[this.currentFrame].duration;
        }
    }

    tick = function() {
        this.updateAnimation();
        this.x += this.velX;

        if (this.x >= _WIDTH || this.x + this.width <= 0) {
            handler.remove(this);
        }
    }

    render = function(g) {  
        // g.fillStyle = 'black';
        // g.fillRect(this.x, this.y, this.width, this.height);

        if (this.facingRight) {
            g.drawImage(Projectile.animation.imgs[this.currentFrame], this.x, this.y, this.width, this.height);
        } else {
            g.save();
            g.translate(this.width, 0);
            g.scale(-1, 1);
            g.drawImage(Projectile.animation.imgs[this.currentFrame], -this.x, this.y, this.width, this.height);
            g.restore();
        }


        // g.strokeStyle = 'red';
        // g.beginPath();
        // g.rect(this.x, this.y, this.width, this.height);
        // g.stroke();
    }
}