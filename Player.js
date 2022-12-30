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

        for (var i = 1; i <= 6; i++) {
            var img = new Image();
            img.src = 'src/assets/megaman/run/run-' + i + '.png';
            img.duration = 5;
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

        var airDashAnimation = {
            repeat: true
        };
        animation = airDashAnimation;
        animation.imgs = [];

        img = new Image();
        img.src = 'src/assets/megaman/airdash/airdash.png';
        img.duration = 1000;
        animation.imgs.push(img);
        Player.animations.set('airDashAnimation', airDashAnimation);

        var idleAnimation = {
            repeat: true
        }
        animation = idleAnimation;
        animation.imgs = [];

        img = new Image();
        img.src = 'src/assets/megaman/idle/idle-1.png';
        img.duration = 35;
        animation.imgs.push(img);

        img = new Image();
        img.src = 'src/assets/megaman/idle/idle-2.png';
        img.duration = 35;
        animation.imgs.push(img);

        Player.animations.set('idleAnimation', idleAnimation);

    }

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 50;
        this.width = 85;
        this.height = 120;
        this.landed = false;
        this.jumping = false;
        this.animation = Player.animations.get('spawnAnimation');
        this.currentFrame = 0;
        this.frameDuration = this.animation.imgs[0].duration;
        this.spawning = true;
        this.shooting = false;
        this.shootCd = 0;
        this.hurting = false;
        this.airdashing = false;
        this.canAirdash = false;
        this.speed = 12;
        this.imune = false;
        this.visible = true;
        this.facingRight = true;
        this.enableControls = true;
    }

    checkControls = function() {
        if (gamestate == 'BOSS_BATTLE') {
            if (this.enableControls) {

                if (Controls.isPressed(65)) {
                    if (!this.landed) {
                        this.velX = -Math.abs(this.velX);
                    } else {
                        this.velX = -this.speed / 2;
                    }
                }
        
                if (Controls.isPressed(68)) {
                    if (!this.landed) {
                        this.velX = Math.abs(this.velX);
                    } else {
                        this.velX = this.speed / 2;
                    }
                }
        
                if (!Controls.isPressed(65, 68)) {
                    this.velX = 0;
                }
            }
        }

        if (this.shooting && !Controls.isPressed(70)) {
            this.shooting = false;
        }
    }

    startFlashing = function(interval, duration) {
        var interval = setInterval(() => {
            this.visible = !this.visible;
        }, interval);

        setTimeout(() => {
            clearInterval(interval);
            this.visible = true;
        }, duration);
    }

    takeDamage = function() {
        if (this.imune) {
            return;
        }

        this.velX = -4;
        this.hurting = true;
        this.imune = true;
        this.velY = 0;
        this.airdashing = false;
        this.enableControls = false;



        setTimeout(() => {
            this.velX = this.speed;
            this.hurting = false;
            this.startFlashing(25, 3000 - 1200);
            this.enableControls = true;
        }, 1200);

        setTimeout(() => {
            this.imune = false;
        }, 3000);
    }

    shoot = function() {
        if (this.spawning || this.shooting || this.hurting || this.airdashing || !this.enableControls) {
            return;
        }

        this.shootCd = 40;
        this.shooting = true;
        handler.add(new Projectile(this.x + this.width / 2, this.y + this.height / 2 + 15, this.facingRight));
    }

    airdash = function() {
        if (this.airdashing || !this.canAirdash || !this.enableControls) {
            return;
        }

        this.airdashing = true;
        this.velY = 0;

        this.velX = (gamestate == 'BOSS_BATTLE' ? (this.speed / 2) * 1.5 : this.speed * 1.3);

        this.canAirdash = false;
        setTimeout(() => {
           this.airdashing = false;
        }, 500);
    }

    jump = function() {
        if (this.spawning || this.hurting || !this.enableControls) {
            return;
        }

        if (this.jumping) {
            this.airdash();
            return;
        }

        if (!this.landed) {
            return;
        }

        this.velY = -15;
        this.jumping = true;

        setTimeout(() => {
            this.canAirdash = true;
        }, 150);
    }

    updateAnimations = function() {
        var tempAnimation = Player.animations.get('idleAnimation');
        if (this.velX == 0 && this.landed && !this.spawning && this.animation != tempAnimation) {
            this.animation = tempAnimation;
            this.currentFrame = 0;
            this.frameDuration = tempAnimation.imgs[this.currentFrame].duration;
        }

        if (this.airdashing && this.animation != Player.animations.get('airDashAnimation')) {
            this.animation = Player.animations.get('airDashAnimation');
            this.currentFrame = 0;
            this.frameDuration = this.animation.imgs[this.currentFrame].duration;
        }

        if (this.landed && this.velX != 0 && this.animation != Player.animations.get('runAnimation') &&
            !this.spawning && !this.shooting && this.shootCd <= 0 && !this.hurting) {

            this.animation = Player.animations.get('runAnimation');
            this.currentFrame = 0;
            this.frameDuration = this.animation.imgs[this.currentFrame].duration;

        }

        if (this.landed && this.spawning) {
            if (this.currentFrame == 0) {
                this.currentFrame++;
                this.frameDuration = this.animation.imgs[this.currentFrame].duration;

            }

            if (this.currentFrame == 1) {
                var center = this.x + this.width / 2;
                this.x = center - this.width/2;
            }

            if (this.currentFrame == 2) {
                var center = this.x + this.width / 2;
                this.x = center - this.width/2;
            }

            if (this.currentFrame == 3) {
                var center = this.x + this.width / 2;
                this.x = center - this.width/2;
            }

            if (this.currentFrame == this.animation.imgs.length - 1) {
                setTimeout(() => {
                    dialog = undefined;
                    this.spawning = false;
                // }, (firstTry ? 9500 : 400));
                }, (100));
            }
        }

        if (!this.landed && !this.spawning && !this.airdashing && !this.hurting) {
            this.animation = Player.animations.get('jumpAnimation');

            if (this.velY >= 0) {
                this.currentFrame = 1;
            } else {
                this.currentFrame = 0;
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

        if (gamestate == 'BOSS_BATTLE') {
            this.x = clamp(this.x + this.velX, 0, 800 - this.width);

            if (this.velX < 0 && !this.hurting) {
                this.facingRight = false;
            } else if (this.velX > 0 && !this.hurting) {
                this.facingRight = true;
            }
        }
        
        this.shootCd = clamp(this.shootCd - 1, 0, 100);
        
        if (!this.airdashing && !this.hurting) {
            this.velY += 0.75;
        }
        
        var landed = false;
        for (let obj of handler.selectByBehavior('platform')) {
            if (obj.y >= this.y + this.height && intersects(this, obj, 0, this.velY)) {
                landed = true;
                this.canAirdash = false;
                this.velY = 0;
                this.y = obj.y - this.height;
                this.jumping = false;

                if (!this.spawning && gamestate == 'INFINITE_RUNNER') {
                    this.velX = this.speed;
                }
                break;
            }

        }
        this.landed = landed;

        

        if (!this.landed) {
            this.y += this.velY;
        }

        if (!this.spawning) {
            for (let obj of handler.selectByBehavior('platform')) {
                if (intersects(this, obj, this.velX, 0)) {
                    this.takeDamage();
                }
            }

            for (let obj of handler.selectByType('BOSS')) {
                if (intersects(this, obj.getHurtbox())) {
                    this.takeDamage();
                }
            }
        }
        
    }

    render = function(g) {
        if (!this.visible) {
            return;
        }

        const img = this.animation.imgs[this.currentFrame];
        if (this.facingRight) {
            g.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            g.save();
            g.translate(this.width, 0);
            g.scale(-1, 1);
            g.drawImage(this.animation.imgs[this.currentFrame], -this.x, this.y, this.width, this.height);
            g.restore();
        }

        // g.strokeStyle = 'red';
        // g.beginPath();
        // g.rect(this.x, this.y, this.width, this.height);
        // g.stroke();
    }
}