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
        this.player?.render(g);

        this.objects.forEach(obj => {
            obj.render(g);
        });
    }
}