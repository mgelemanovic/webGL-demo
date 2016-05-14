var Enemy = function (spawn) {
    MovableObject.call(this, game.textureManager.items, 5, 50);
    this.tag = "Enemy";
    this.rigidBody.speed.x = 0.002;
    this.spawn = spawn;
};

Enemy.prototype = Object.assign(Object.create(MovableObject.prototype), {
    constructor: Enemy,
    onCollision: function (other, direction) {
        if (direction == "LEFT" || direction == "RIGHT")
            this.rigidBody.speed.x *= -1;
        MovableObject.prototype.onCollision.call(this, other, direction);
    },
    writeData: function () {
        var data = GameObject.prototype.writeData.call(this);
        data.pos.x = this.spawn.x;
        data.pos.y = this.spawn.y;
        return data;
    }
});