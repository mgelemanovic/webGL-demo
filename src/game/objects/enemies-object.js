var Enemy = function (texturePool, textureIndex, spawn) {
    MovableObject.call(this, texturePool, textureIndex, 50);
    this.tag = "Enemy";
    this.spawn = spawn;
};

Enemy.prototype = Object.assign(Object.create(MovableObject.prototype), {
    constructor: Enemy,
    writeData: function () {
        var data = GameObject.prototype.writeData.call(this);
        data.pos.x = this.spawn.x;
        data.pos.y = this.spawn.y;
        return data;
    },
    interact: function (other, direction) {
    },
    kill: function () {
        game.scene.removeObjectFromScene(game.scene.enemies, this.position);
    }
});

var SlimeEnemy = function (spawn) {
    Enemy.call(this, game.textureManager.enemy.slime.normal, 0, spawn);
    this.tag = "SlimeEnemy";
    this.rigidBody.speed.x = -0.002;
    this.collider.offset.y = -0.25;
    this.collider.h = 0.5;
    this.debug = true;
};

SlimeEnemy.prototype = Object.assign(Object.create(Enemy.prototype), {
    constructor: SlimeEnemy,
    changeDirection: function () {
        this.rigidBody.speed.x *= -1;
        this.scale.x *= -1;
    },
    onCollision: function (other, direction) {
        if (direction == "LEFT" || direction == "RIGHT")
            this.changeDirection();
        MovableObject.prototype.onCollision.call(this, other, direction);
    },
    interact: function (other, direction) {
        if (direction == "UP") {
            this.kill();
            other.rigidBody.force.y += 0.05;
        }
        else {
            other.hurt(0.5);
            if (other.immunityPeriod > 0)
                this.changeDirection();
        }
    }
});