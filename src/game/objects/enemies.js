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
        this.position = this.spawn;
        game.scene.removed.push(this);
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
        if (this.position.y < -4)
            Enemy.prototype.kill.call(this);
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
            other.bounce(7.5);
        }
        else if (!this.killed) {
            if (other.immunityPeriod <= 0)
                this.changeDirection();
            other.hurt(0.5);
        }
    }
});

var SawEnemy = function (spawn) {
    Enemy.call(this, game.textureManager.enemy.saw, 0, spawn);
    this.tag = "SawEnemy";
    this.animator = new Animator(20);
    this.speed.x = -3.5;

    this.collider.offset.y = -0.25;
    this.collider.h = 0.5;
};

SawEnemy.prototype = Object.assign(Object.create(Enemy.prototype), {
    constructor: SawEnemy,
    update: function () {
        RigidBody.prototype.update.call(this);
        this.animator.animate(this, game.textureManager.enemy.saw.slice(0, 2));

        if (this.speed.y < 0)
            this.changeDirection();

        if (this.position.y < -4)
            Enemy.prototype.kill.call(this);
    },
    changeDirection: function () {
        this.speed.x *= -1;
        this.speed.y = 0;
    },
    onCollision: function (other, direction) {
        if (direction == "LEFT" || direction == "RIGHT")
            this.changeDirection();
        RigidBody.prototype.onCollision.call(this, other, direction);
    },
    interact: function (other, direction) {
        other.hurt(0.5);
        if (direction == "UP") {
            other.bounce(3);
        }
    }
});

var GhostEnemy = function (spawn) {
    Enemy.call(this, game.textureManager.enemy.ghost, 0, spawn);
    this.tag = "GhostEnemy";
    this.animator = new Animator(50);
    this.step = 0;
    this.collider.w = 0.5;
    this.collider.h = 0.65;
    this.path = new Vector(Math.max(1, 3 * Math.random()), Math.max(1, 3 * Math.random()));
};

GhostEnemy.prototype = Object.assign(Object.create(Enemy.prototype), {
    constructor: GhostEnemy,
    update: function () {
        this.position.x = this.spawn.x + this.path.x * Math.cos(this.step / 60);
        this.position.y = this.spawn.y + this.path.y * Math.sin(2 * this.step / 60);
        this.step++;
        this.animator.animate(this, game.textureManager.enemy.ghost.slice(0, 2));
    },
    interact: function (other, direction) {
        other.hurt(0.5);
    }
});

Creator["SlimeEnemy"] = {
    create: function (info) {
        return new SlimeEnemy(info.pos);
    },
    pool: function () {
        return game.scene.enemies;
    },
    editor: function () {
        return new SlimeEnemy();
    }
};

Creator["SawEnemy"] = {
    create: function (info) {
        return new SawEnemy(info.pos);
    },
    pool: function () {
        return game.scene.enemies;
    },
    editor: function () {
        return new SawEnemy();
    }
};

Creator["GhostEnemy"] = {
    create: function (info) {
        return new GhostEnemy(info.pos);
    },
    pool: function () {
        return game.scene.enemies;
    },
    editor: function () {
        return new GhostEnemy();
    }
};