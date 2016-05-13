var Enemy = function (spawn) {
    MovableObject.call(this, game.textureManager.items, 5, 50);
    this.tag = "Enemy";
    this.rigidBody.speed.x = 0.002;
    this.spawn = spawn;
};

Enemy.prototype = Object.assign(Object.create(MovableObject.prototype), {
    constructor: Enemy,
    update: function () {
        MovableObject.prototype.update.call(this);
        this.checkForCollisionWith([game.player]);
    },
    onCollision: function (other, direction) {
        console.log(direction);
        MovableObject.prototype.onCollision.call(this, other, direction);
        if (direction == "LEFT" || direction == "RIGHT")
            this.rigidBody.speed.x *= -1;
    }
});