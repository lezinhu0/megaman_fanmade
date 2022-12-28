class Player {
    static animations = new Map();
    static img = undefined;

    static {
        Player.img = new Image();
        Player.img.src = 'src/assets/megaman/idle/idle-1.png';

        var runAnimation = {
            repeat: true
        };
        var animation = runAnimation;
        animation.imgs = [];

        for (var i = 4; i <= 7; i++) {
            var img = new Image();
            img.src = 'src/assets/megaman/run/run-' + i + '.png';
            img.duration = 6;
            animation.imgs.push(img);
        }
        Player.animations.set('runAnimation', runAnimation);

        var spawnAnimation = {
            repeat: false
        };
        animation = spawnAnimation;
        animation.imgs = [];
        var img = new Image();
        img.src = 'src/assets/megaman/spawning/spawning-1.png';
        img.duration = 1000;
        animation.imgs.push(img);

        img = new Image();
        img.src = 'src/assets/megaman/spawning/spawning-2.png';
        img.duration = 8;
        animation.imgs.push(img);

        img = new Image();
        img.src = 'src/assets/megaman/spawning/spawning-3.png';
        img.duration = 20;
        animation.imgs.push(img);

        img = new Image();
        img.src = 'src/assets/megaman/spawning/spawning-4.png';
        img.duration = 8;
        animation.imgs.push(img);

        img = new Image();
        img.src = 'src/assets/megaman/spawning/spawning-5.png';
        img.duration = 8;
        animation.imgs.push(img);
        Player.animations.set('spawnAnimation', spawnAnimation);

        var jumpAnimation = {
            repeat: false
        };
        animation = jumpAnimation;
        animation.imgs = [];
        img = new Image();
        img.src = 'src/assets/megaman/jump/jump-1.png';
        img.duration = 100000;
        animation.imgs.push(img);

        img = new Image();
        img.src = 'src/assets/megaman/jump/jump-2.png';
        img.duration = 100000;
        animation.imgs.push(img);
        Player.animations.set('jumpAnimation', jumpAnimation);

        var shootAnimation = {
            repeat: true
        };
        animation = shootAnimation;
        animation.imgs = [];

        for(var i = 3; i <= 8; i++) {
            var img = new Image();
            img.src = 'src/assets/megaman/run-shoot/run-shoot-' + i + '.png';
            img.duration = 5;
            animation.imgs.push(img);
        }
        Player.animations.set('shootAnimation', shootAnimation);

        var hurtAnimation = {
            repeat: true
        };
        animation = hurtAnimation;
        animation.imgs = [];

        for(var i = 1; i <= 2; i++) {
            var img = new Image();
            img.src = 'src/assets/megaman/hurt/hurt-' + i + '.png';
            img.duration = 3;
            animation.imgs.push(img);
        }
        Player.animations.set('hurtAnimation', hurtAnimation);
    }

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 50;
        this.width = 20;
        this.height = 80;
        this.landed = false;
        this.jumping = false;
        this.animation = Player.animations.get('spawnAnimation');
        this.currentFrame = 0;
        this.frameDuration = this.animation.imgs[0].duration;
        this.spawning = true;
        this.shooting = false;
        this.shootCd = 0;
        this.hurting = false;
    }

    checkControls = function() {
        if (Controls.isPressed(32)) {
            this.jump();
        }

        if (Controls.isPressed(107)) {
            this.velX++;
        }

        if (Controls.isPressed(109)) {
            this.velX--;
        }

        if (Controls.isPressed(70)) {
            this.shoot();
        }

        if (this.shooting && !Controls.isPressed(70)) {
            this.shooting = false;
        }
    }

    shoot = function() {
        if (this.spawning || this.shooting || this.hurting) {
            return;
        }

        this.shootCd = 40;
        this.shooting = true;
        handler.add(new Projectile(this.x + this.width - 5, this.y + 33));
    }

    jump = function() {
        if (this.jumping || this.hurting) {
            return;
        }
        this.velY = -15;
        this.jumping = true;
    }

    updateAnimations = function() {
        if (this.landed && this.velX != 0 && this.animation != Player.animations.get('runAnimation') &&
            !this.spawning && !this.shooting && this.shootCd <= 0 && !this.hurting) {

            this.animation = Player.animations.get('runAnimation');
            this.currentFrame = 0;
            this.frameDuration = this.animation.imgs[this.currentFrame].duration;

            var base = this.y + this.height;

            this.width = 80;
            this.height = 80;

            this.y = base - this.height;
        }

        if (this.landed && this.spawning) {
            if (this.currentFrame == 0) {
                this.currentFrame++;
                this.frameDuration = this.animation.imgs[this.currentFrame].duration;

            }

            if (this.currentFrame == 1) {
                var center = this.x + this.width / 2;
                this.width = 50;
                this.x = center - this.width/2;
            }

            if (this.currentFrame == 2) {
                var center = this.x + this.width / 2;
                this.width = 80;
                this.x = center - this.width/2;
            }

            if (this.currentFrame == 3) {
                var center = this.x + this.width / 2;
                this.width = 80;
                this.x = center - this.width/2;
            }

            if (this.currentFrame == this.animation.imgs.length - 1) {
                this.spawning = false;
            }
        }

        if (!this.landed && !this.spawning) {
            this.animation = Player.animations.get('jumpAnimation');

            var base = this.y + this.height;
            this.height = 110;
            this.width = 90;
            this.y = base - this.height;

            if (this.velY >= 0) {
                this.currentFrame = 0;
            } else {
                this.currentFrame = 1;
            }

            this.frameDuration = this.animation.imgs[this.currentFrame].duration;
        }

        if (this.landed && this.shooting && this.animation != Player.animations.get('shootAnimation')) {
            this.animation = Player.animations.get('shootAnimation');
            this.currentFrame = 0;
            this.frameDuration = this.animation.imgs[this.currentFrame].duration;
        }

        if (this.hurting && this.animation != Player.animations.get('hurtAnimation')) {
            this.animation = Player.animations.get('hurtAnimation');
            this.currentFrame = 0;
            this.frameDuration = this.animation.imgs[this.currentFrame].duration;
        }

        this.frameDuration--;

        if (this.frameDuration <= 0) {
            this.currentFrame++;

            if (this.currentFrame >= Number(this.animation.imgs.length)) {
                if (this.animation.repeat) {
                    this.currentFrame = 0;
                    this.frameDuration = this.animation.imgs[this.currentFrame].duration;
                } else {
                    this.currentFrame = this.animation.imgs.length - 1;
                }
            }
            
            this.frameDuration = this.animation.imgs[this.currentFrame].duration;
        }
    }

    tick = function() {
        this.updateAnimations();
        this.checkControls();

        if (this.y >= _HEIGHT) {
            newGame();
            return;
        }

        this.shootCd--;

        this.y += this.velY;

        var landed = false;
        handler.selectByBehavior('platform').forEach(obj => {
            if (obj.y > this.x + this.height && intersects(this, obj, 0, 5)) {
                landed = true;
                this.velY = 0;
                this.y = obj.y - this.height;
                this.jumping = false;

                if (!this.spawning && this.velX == 0) {
                    this.velX = 12;
                }
            }

            if (intersects(this, obj, this.velX, 0)) {
                this.velX = -2;
                this.hurting = true;

                setTimeout(() => {
                    this.velX = 12;
                    this.hurting = false;
                }, 1000);
            }
        });
        this.landed = landed;

        if (!this.landed) {
            this.velY += 0.75;
        }
        
    }

    render = function(g) {
        const img = this.animation.imgs[this.currentFrame];
        g.drawImage(img, this.x, this.y, this.width, this.height);
    }
}