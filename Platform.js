class Platform {

    static imgs = new Map();

    static {
        var img = new Image();
        img.src = 'src/assets/tileset/ground/ground-7.png';
        Platform.imgs.set('7', img);

        img = new Image();
        img.src = 'src/assets/tileset/ground/ground-8.png';
        Platform.imgs.set('8', img);

        img = new Image();
        img.src = 'src/assets/tileset/ground/ground-9.png';
        Platform.imgs.set('9', img);
    }

    constructor(x, y, width = 780) {
        this.x = x;
        this.y = y;
        this.width = (width / 78) * 78;
        this.height = 100;
        this.behaviors = ['platform'];
        this.offsetY = -10;
        this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
    }

    tick = function() {
        if (gamestate == 'INFINITE_RUNNER') {
            this.x -= handler.player.velX;
        }
        

        if (this.x + this.width <= 0) {
            var x = handler.selectByBehavior('platform').slice(-1)[0].x;
            var y = handler.selectByBehavior('platform').slice(-1)[0].y;

            handler.remove(this);

            if (gamestate == 'BOSS_BATTLE') {
                return;
            }

            var random = Math.random();
            if (random >= 0.75) {

                var platform = new Platform(x + this.width + 400, y);
                random = Math.random();
                if (random >= 0.8) {
                    handler.add(new Enemy1(platform.x + platform.width / 2, platform.y));
                } else if (random >= 0.6) {
                    handler.add(new Enemy2(platform.x + platform.width - 150, platform.y));
                }
                handler.add(platform);

            } else if (random >= 0.5) {

                var platform = new Platform(x + this.width + 300, clamp(y - 100, 300, 500));

                if (Math.random() >= 0.6) {
                    handler.add(new Enemy2(platform.x + platform.width - 150, platform.y));
                }

                handler.add(platform);

            } else if (random >= 0.25) {

                var platform = new Platform(x + this.width + 800, clamp(y - 100, 300, 500));
                if (Math.random() >= 0.6) {
                    handler.add(new Enemy2(platform.x + platform.width - 150, platform.y));
                }
                handler.add(platform);

            } else {

                var platform = new Platform(x + this.width, 500);
                random = Math.random();
                if (random >= 0.8) {
                    handler.add(new Enemy1(platform.x + platform.width / 2, platform.y));
                } else if (random >= 0.6) {
                    handler.add(new Enemy2(platform.x + platform.width - 150, platform.y));
                }
                handler.add(platform);
            }
        }
    }

    render = function(g) {
        
        for (var i = 0; i < this.width / 78; i++) {
            if (i == 0) {
                g.drawImage(Platform.imgs.get('7'), this.x, this.y + this.offsetY);
            } else if (i + 1 >= this.width / 78) {
                g.drawImage(Platform.imgs.get('9'), this.x + (i * 78), this.y + this.offsetY);
            } else {
                g.drawImage(Platform.imgs.get('8'), this.x + (i * 78), this.y + this.offsetY);
            }
        }


        // g.fillStyle = this.color;
        // g.fillRect(this.x, this.y, this.width, this.height);

        // g.strokeStyle = 'red';
        // g.beginPath();
        // g.rect(this.x, this.y, this.width, this.height);
        // g.stroke();
    }
}