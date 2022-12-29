class Controls {
    static keys = new Set();

    static keydown = function(e) {

        if (e.keyCode == 32 && !Controls.isPressed(32)) {
            handler.player.jump();
        }
        
        Controls.keys.add(e.keyCode);
    }
    
    static keyup = function(e) {
        Controls.keys.delete(e.keyCode);
    }

    static isPressed = function(...keyCodes) {
        for (let keyCode of keyCodes) {
            if (Controls.keys.has(keyCode)) {
                return true;
            }
        }
        return false;
    }
}