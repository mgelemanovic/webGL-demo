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

Vector.prototype.setv = function(newVector) {
    this.x = newVector.x;
    this.y = newVector.y;
};

Vector.prototype.set = function(newX, newY) {
    this.x = newX;
    this.y = newY;
};

Vector.prototype.addv = function(vector2) {
    this.x += vector2.x;
    this.y += vector2.y;
};

Vector.prototype.add = function(x2, y2) {
    this.x += x2;
    this.y += y2;
};

Vector.prototype.dot = function(vector) {
    return this.x * vector.x + this.y * vector.y;
};