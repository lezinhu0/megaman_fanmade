class Handler {
    constructor() {
        this.objects = [];
    }

    add = function(obj) {
        this.objects.push(obj);
    }

    remove = function(obj) {
        this.objects.splice(this.objects.indexOf(obj), 1);
    }

    selectByBehavior = function(behavior) {
        var selectedItems = [];
        this.objects.forEach(obj => {
            if (obj.behaviors?.indexOf(behavior) > -1) {
                selectedItems.push(obj);
            }
        });
        return selectedItems;
    }

    tick = function() {
        this.player?.tick();

        this.objects.forEach(obj => {
            obj.tick();
        });
    }

    render = function(g) {
        this.objects.forEach(obj => {
            obj.render(g);
        });

        this.player?.render(g);
    }

    sort = function() {
        this.objects.sort((a, b) => {
            if (a.behaviors && a.behaviors.indexOf('platform') > -1) {
                if (b.behaviors && b.behaviors.indexOf('platform') > -1) {
                    return 0;
                }
                return -1;
            }

            if (b.behaviors && b.behaviors.indexOf('platform') > -1) {
                return 1;
            };

            return 0;
        });
    }

    selectByType = function(type) {
        var selectedObjs = [];

        for (let obj of this.objects) {
            if (obj.type && obj.type == type) {
                selectedObjs.push(obj);
            }
        }

        return selectedObjs;
    }
}