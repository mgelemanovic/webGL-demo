var Vector = function(x, y) {
    this.x = x;
    this.y = y;
};

Vector.prototype.get = function() {
    return {
        x: this.x,
        y: this.y
    };
};

Vector.prototype.set = function(newX, newY) {
    this.x = newX;
    this.y = newY;
};

Vector.prototype.dot = function(vector) {
    return this.x * vector.x + this.y * vector.y;
};