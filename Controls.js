class Controls {
    static keys = new Set();

    static keydown = function(e) {
        Controls.keys.add(e.keyCode);
    }
    
    static keyup = function(e) {
        Controls.keys.delete(e.keyCode);
    }

    static isPressed = function(keyCode) {
        return Controls.keys.has(keyCode);
    }
}