var Enemy = function (spawn) {
    MovableObject.call(this, game.textureManager.enemy.slime.normal, 0, 50);
    this.tag = "Enemy";
    this.rigidBody.speed.x = -0.002;
    this.spawn = spawn;
    this.debug = true;
};

Enemy.prototype = Object.assign(Object.create(MovableObject.prototype), {
    constructor: Enemy,
    changeDirection: function() {
        this.rigidBody.speed.x *= -1;
        this.scale.x *= -1;
    },
    onCollision: function (other, direction) {
        if (direction == "LEFT" || direction == "RIGHT")
            this.changeDirection();
        MovableObject.prototype.onCollision.call(this, other, direction);
    },
    writeData: function () {
        var data = GameObject.prototype.writeData.call(this);
        data.pos.x = this.spawn.x;
        data.pos.y = this.spawn.y;
        return data;
    }
});