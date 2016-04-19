var Vector = function (x, y) {
    this.x = x;
    this.y = y;
};

Vector.prototype = {
    get: function () {
        return {
            x: this.x,
            y: this.y
        };
    },
    setv: function (newVector) {
        this.x = newVector.x;
        this.y = newVector.y;
    },
    set: function (newX, newY) {
        this.x = newX;
        this.y = newY;
    },
    addv: function (vector2) {
        this.x += vector2.x;
        this.y += vector2.y;
    },
    add: function (x2, y2) {
        this.x += x2;
        this.y += y2;
    },
    dot: function (vector) {
        return this.x * vector.x + this.y * vector.y;
    }
};