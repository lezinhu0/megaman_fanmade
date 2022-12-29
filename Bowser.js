class Bowser {

    static animation = {
        repeat: true
    };

    static {
        Bowser.animation.imgs = [];
        for (var i = 1; i <= 4; i++) {
            var img = new Image();
            img.src = 'src/assets/bowser/crying/crying-' + i + '.png';
            img.duration = 15;
            Bowser.animation.imgs.push(img);
        }
    }

    constructor(x, y) {
        this.width = 315 / 2;
        this.height = 295 / 2;
        this.x = x;
        this.y = y - this.height;

        this.currentFrame = 0;
        this.frameDuration = 20;
    }

    updateAnimations = function() {
        this.frameDuration--;

        if (this.frameDuration <= 0) {
            this.currentFrame++;
            
            if (this.currentFrame >= Bowser.animation.imgs.length) {
                if (Bowser.animation.repeat) {
                    this.currentFrame = 0;
                }
            }
            this.frameDuration = Bowser.animation.imgs[this.currentFrame].duration;
        }
    }

    tick = function() {
        this.updateAnimations();

        const player = handler.player;
        this.x -= player.velX;

        if (this.x + this.width <= 0) {
            handler.remove(this);
        }
    }

    render = function(g) {
        g.drawImage(Bowser.animation.imgs[this.currentFrame], this.x, this.y, this.width, this.height);
    }
}