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

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 780;
        this.height = 100;
        this.behaviors = ['platform'];
        this.offsetY = -10;
    }

    tick = function() {
        this.x -= handler.player.velX;

        if (this.x + this.width <= 0) {
            var x = handler.selectByBehavior('platform').slice(-1)[0].x;
            var y = handler.selectByBehavior('platform').slice(-1)[0].y;

            handler.remove(this);

            var random = Math.random();
            if (random >= 0.75) {

                var platform = new Platform(x + this.width + 400, y);
                if (Math.random() >= 0.6) {
                    handler.add(new Enemy1(platform.x, platform.y));
                }
                handler.add(platform);

            } else if (random >= 0.5) {

                var platform = new Platform(x + this.width + 300, clamp(y - 100, 300, 500));
                handler.add(platform);

            } else if (random >= 0.25) {

                handler.add(new Platform(x + this.width + 800, clamp(y - 100, 300, 500)));

            } else {

                var platform = new Platform(x + this.width, 500);
                if (Math.random() >= 0.6) {
                    handler.add(new Enemy1(platform.x, platform.y));
                }
                handler.add(platform);
            }
        }
    }

    render = function(g) {
        // g.styokeStyle = 'red';
        // g.beginPath();
        // g.rect(this.x, this.y, this.width, this.height);
        // g.stroke();

        for (var i = 0; i < this.width / 78; i++) {
            if (i == 0) {
                g.drawImage(Platform.imgs.get('7'), this.x, this.y + this.offsetY);
            } else if (i + 1 >= this.width / 78) {
                g.drawImage(Platform.imgs.get('9'), this.x + (i * 78), this.y + this.offsetY);
            } else {
                g.drawImage(Platform.imgs.get('8'), this.x + (i * 78), this.y + this.offsetY);
            }
        }
    }
}