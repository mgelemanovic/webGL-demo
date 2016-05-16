var Enemy = function (texturePool, textureIndex, spawn) {
    RigidBody.call(this, texturePool, textureIndex);
    this.tag = "Enemy";
    this.spawn = spawn;
};

Enemy.prototype = Object.assign(Object.create(RigidBody.prototype), {
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
    Enemy.call(this, game.textureManager.enemy.slime, 0, spawn);
    this.tag = "SlimeEnemy";
    this.animator = new Animator(20);
    this.speed.x = -2;

    this.collider.offset.y = -0.25;
    this.collider.h = 0.5;
    this.collider.w = 0.8;

    this.killed = false;
};

SlimeEnemy.prototype = Object.assign(Object.create(Enemy.prototype), {
    constructor: SlimeEnemy,
    update: function () {
        RigidBody.prototype.update.call(this);
        if (!this.killed) {
            this.checkForCollisionWith(game.scene.enemies);
            this.animator.animate(this, game.textureManager.enemy.slime.slice(0, 2));
        }
    },
    changeDirection: function () {
        this.position.y += 0.25;        // Little bounce when changing direction
        this.speed.x *= -1;
        this.scale.x *= -1;
    },
    onCollision: function (other, direction) {
        if (direction == "LEFT" || direction == "RIGHT")
            this.changeDirection();
        RigidBody.prototype.onCollision.call(this, other, direction);
    },
    kill: function () {
        this.killed = true;
        this.speed.x = 0;
        this.texturePool = game.textureManager.enemy.slime;
        this.textureIndex = 2;
    },
    interact: function (other, direction) {
        if (direction == "UP") {
            this.kill();
            other.speed.y = 7.5;
        }
        else if (!this.killed) {
            if (other.immunityPeriod <= 0)
                this.changeDirection();
            other.hurt(0.5);
        }
    }
});

creator["SlimeEnemy"] = {
    create: function (info) {
        return new SlimeEnemy(info.pos);
    },
    pool: function () {
        return game.scene.enemies;
    }
};