function clamp(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

function intersects(obj1, obj2, offsetX = 0, offsetY = 0) {
    if (obj1.x + (offsetX < 0 ? -offsetX : 0) < obj2.x + obj2.width && obj1.x + obj1.width + (offsetX > 0 ? offsetX : 0) > obj2.x) {
        if (obj1.y + (offsetY < 0 ? -offsetY : 0) < obj2.y + obj2.height && obj1.y + obj1.height + (offsetY > 0 ? offsetY : 0) > obj2.y) {
            return true;
        }
    }
    return false;
}