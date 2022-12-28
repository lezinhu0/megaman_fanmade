function clamp(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

function intersects(obj1, obj2, offsetX = 0, offsetY = 0) {
    if (obj1.x + offsetX < obj2.x + obj2.width && obj1.x + obj1.width + offsetX > obj2.x) {
        if (obj1.y + offsetY < obj2.y + obj2.height && obj1.y + obj1.height + offsetY > obj2.y) {
            return true;
        }
    }
    return false;
}