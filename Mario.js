class Mario {

    static animations = new Map();

    static {
        var animation = { repeat: true };
        animation.imgs = [];

        var img = new Image();
        img.src = 'src/assets/mario/idle/idle-1.png';
        img.duration = 100;
        animation.imgs.push(img);

        img = new Image();
        img.src = 'src/assets/mario/idle/idle-2.png';
        img.duration = 4;
        animation.imgs.push(img);

        img = new Image();
        img.src = 'src/assets/mario/idle/idle-3.png';
        img.duration = 15;
        animation.imgs.push(img);

        img = new Image();
        img.src = 'src/assets/mario/idle/idle-2.png';
        img.duration = 4;
        animation.imgs.push(img);

        Mario.animations.set('idleAnimation', animation);

        animation = { repeat: true };
        animation.imgs = [];

        for (var i = 1; i <= 8; i++) {
            img = new Image();
            img.src = 'src/assets/mario/run/run-' + i + '.png';
            img.duration = 10;
            animation.imgs.push(img);
        }
        Mario.animations.set('runAnimation', animation);

        animation = { repeat: false };
        animation.imgs = [];

        img = new Image();
        img.src = 'src/assets/mario/charging/charging-1.png';
        img.duration = 10;
        animation.imgs.push(img);
        Mario.animations.set('chargingAnimation', animation);
    }

    constructor(x, y) {
        this.width = 100;
        this.height = 100;
        this.x = x;
        this.y = y - this.height;
        this.speed = 3;
        this.velX = 0;
        this.velY = 0;
        this.animation = Mario.animations.get('idleAnimation');
        this.currentFrame = 0;
        this.frameDuration = this.animation.imgs[0].duration;
        this.facingRight = false;
        this.hp = 75, this.maxHp = this.hp;
        this.imune = true;
        this.type = 'BOSS';
        this.state = 'WALKING';
        this.phase = 0;
        this.bombCount = 0;
        this.specialCd = 300;
        this.visible = true;

        setTimeout(() => {
            this.imune = false;
            this.velX = -this.speed;
        }, 2000);

        setInterval(() => {
            if (this.state == 'WALKING' && this.specialCd <= 0) {
                if (Math.random() >= 0.45) {
                    var random = Math.random();
                    if (random >= 0.5) {
                        this.state = 'ATTACK1';
                    } else {
                        this.state = 'ATTACK2';
                    }
                    this.phase = 0;
                }
            }
        }, 500);
    }

    getHurtbox = function() {
        return {
            x: this.x + 25,
            y: this.y,
            width: this.width - 50,
            height: this.height
        };
    }

    updateAnimations = function() {
        var animation = Mario.animations.get('idleAnimation');
        if (this.state == 'IDLE' && this.animation != animation) {
            this.animation = animation;
            this.currentFrame = 0;
            this.frameDuration = this.animation.imgs[0].duration;
        }
        

        animation = Mario.animations.get('chargingAnimation');
        if (this.state == 'ATTACK1' && this.phase >= 1 && this.animation != animation) {
            this.animation = animation;
            this.currentFrame = 0;
            this.frameDuration = this.animation.imgs[0].duration;
        }
        

        var animation = Mario.animations.get('runAnimation');
        if (this.velX != 0 && this.animation != animation) {
            this.animation = animation;
            this.currentFrame = 0;
            this.frameDuration = this.animation.imgs[0].duration;
        }

        this.frameDuration--;

        if (this.state == 'ATTACK2') {
            this.frameDuration -= 10;
        }

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

    startFlashing = function(interval, duration) {
        var flashInterval = setInterval(() => {
            this.visible = !this.visible;
        }, interval);

        setTimeout(() => {
            clearInterval(flashInterval);
            this.visible = true;
        }, duration);
    }

    takeDamage = function() {
        if (this.imune) {
            return;
        }
        this.hp--;

        this.startFlashing(30, 500);

        this.imune = true;
        setTimeout(() => {
            this.imune = false;
        }, 500);
    }

    tick = function() {
        this.updateAnimations();
        this.specialCd--;

        if (this.hp <= 0) {
            handler.remove(this);
            return;
        }

        this.x = clamp(this.x + this.velX, 0, _WIDTH - this.width);

        if (this.state == 'ATTACK1') {
            if(this.phase == 0) {
                this.velX = 0;
                
                this.bombCount = 0;
                var canGoNext = true;
                if (this.x > 650) {
                    this.x = clamp(this.x - 14, 650, 800);
                    canGoNext = false;
                } else if (this.x < 650) {
                    this.x = clamp(this.x + 14, 0, 650);
                    canGoNext = false;
                }

                if (this.y > 100) {
                    this.y = clamp(this.y - 10, 100, 600);
                    canGoNext = false;
                }

                if (canGoNext) {
                    this.phase = 1;
                }
            }

            if (this.phase == 1) {
                this.facingRight = false;
                this.velX = 0;
                this.velY = 0;

                handler.add(new SpiritBomb(this.x + this.width / 2, this.y - 25));
                this.bombCount++;
                this.phase = 2;
                setTimeout(() => {
                    if (this.bombCount < 10) {
                        this.phase = 1;
                    } else {
                        setTimeout(() => {
                            this.phase = 3;
                        }, 1000);
                    }
                }, 900);
            }

            if (this.phase == 3) {
                var canGoNext = true;
                if (this.y < 500 - this.height) {
                    this.y = clamp(this.y + 15, 0, 500 - this.height);
                    canGoNext = false;
                }

                if (canGoNext) {
                    this.phase = 4;
                }
            }

            if (this.phase == 4) {
                this.phase = 0;
                this.state = 'WALKING';
                this.velX = -this.speed;
                this.specialCd = 400;
            }

        }

        if (this.state == 'ATTACK2') {
            if(this.phase == 0) {
                this.velX = 0;
                var canGoNext = true;
                if (this.x > 650) {
                    this.x = clamp(this.x - 14, 650, 800);
                    canGoNext = false;
                } else if (this.x < 650) {
                    this.x = clamp(this.x + 14, 0, 650);
                    canGoNext = false;
                }

                if (canGoNext) {
                    this.phase = 1;
                }
            }

            if (this.phase == 1) {
                this.facingRight = false;
                this.phase = 2;
                setTimeout(() => {
                    this.phase = 3;
                }, 2000);
            }

            if (this.phase == 3) {
                this.velX = -10;
                this.phase = 4;

                setTimeout(() => {
                    this.phase = 5;
                }, 8400);
            }

            if (this.phase == 5) {
                this.phase = 0;
                this.state = 'WALKING';
                this.velX = this.speed;
                this.specialCd = 400;
            }
        }

        this.y += this.velY;

        if (this.x <= 0 || this.x + this.width >= _WIDTH) {
            this.velX *= -1;
        }

        if (this.velX > 0) {
            this.facingRight = true;
        } else if (this.velX < 0) {
            this.facingRight = false;
        }

        for (let projectile of handler.selectByType('projectile')) {
            if (intersects(this.getHurtbox(), projectile, projectile.velX)) {
                handler.remove(projectile);
                this.takeDamage();
            }
        }
    }

    render = function() {
        g.fillStyle = 'green';
        g.fillRect(this.x, this.y - 20, this.width * clamp((this.hp / this.maxHp), 0, 100), 5);

        g.strokeStyle = 'black';
        g.beginPath();
        g.rect(this.x, this.y - 20, this.width, 5);
        g.stroke();

        if (!this.visible) {
            return;
        }

        if (this.facingRight) {
            g.drawImage(this.animation.imgs[this.currentFrame], this.x, this.y, this.width, this.height);
        } else {
            g.save();
            g.translate(this.width, 0);
            g.scale(-1, 1);
            g.drawImage(this.animation.imgs[this.currentFrame], -this.x, this.y, this.width, this.height);
            g.restore();
        }

        g.strokeStyle = 'red';
        g.beginPath();
        g.rect(this.getHurtbox().x, this.getHurtbox().y, this.getHurtbox().width, this.getHurtbox().height);
        g.stroke();
    }
}