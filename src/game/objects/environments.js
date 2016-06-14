var EnvironmentObject = function (texturePool, textureIndex) {
    RigidBody.call(this, texturePool, textureIndex);
    this.tag = "Environment";
};

EnvironmentObject.prototype = Object.assign(Object.create(RigidBody.prototype), {
    constructor: EnvironmentObject,
    update: function () {},
    interact: function (other, direction) {}
});

var SpikesObject = function () {
    EnvironmentObject.call(this, game.textureManager.items, 8);
    this.tag = "Spikes";
    this.collider.offset.y = -0.25;
    this.collider.h = 0.5;
};

SpikesObject.prototype = Object.assign(Object.create(EnvironmentObject.prototype), {
    constructor: SpikesObject,
    interact: function (other, direction) {
        if (direction == "UP" && other.speed.y < 0)
            other.hurt(1);
    }
});

var CheckpointObject = function () {
    EnvironmentObject.call(this, game.textureManager.items, 4);
    this.tag = "Checkpoint";
    this.animator = new Animator(30);
    this.used = false;
};

CheckpointObject.prototype = Object.assign(Object.create(EnvironmentObject.prototype), {
    constructor: CheckpointObject,
    update: function () {
        if (this.used)
            this.animator.animate(this, game.textureManager.items.slice(5, 7));
    },
    interact: function (other, direction) {
        if (!this.used) {
            other.respawnPosition = this.position;
            this.used = true;
        }
    }
});

var BridgeObject = function (spawn) {
    EnvironmentObject.call(this, game.textureManager.items, 9);
    this.tag = "Bridge";
    this.steppedOn = false;
    this.countdown = 500;
    this.spawn = spawn;
};

BridgeObject.prototype = Object.assign(Object.create(EnvironmentObject.prototype), {
    constructor: BridgeObject,
    update: function () {
        if (this.steppedOn)
            this.countdown -= game.elapsed;
        if (this.countdown <= 0)
            this.applyPhysics();

        if (this.position.y < -5) {
            this.position.setv(this.spawn);
            game.scene.removeObject(this);
        }
    },
    interact: function (other, direction) {
        if (direction == "UP") {
            RigidBody.prototype.onCollision.call(other, this, "UP");
            this.steppedOn = true;
        }
    },
    writeData: function () {
        var data = GameObject.prototype.writeData.call(this);
        data.pos.x = this.spawn.x;
        data.pos.y = this.spawn.y;
        return data;
    }
});

var BoxObject = function () {
    EnvironmentObject.call(this, game.textureManager.items, 10);
    this.tag = "Box";
    this.collider.h = this.collider.w = 0.65;
    this.collider.offset.y = -0.2;
};

BoxObject.prototype = Object.assign(Object.create(EnvironmentObject.prototype), {
    constructor: BoxObject,
    interact: function (other, direction) {
        RigidBody.prototype.onCollision.call(other, this, direction);
        if (direction == "DOWN") {
            game.scene.removeObject(this);
            var random = Math.random();
            if (random < 0.4)
                Factory({pos: this.position, tag: "CoinPickUp", texture: 1});
            else if (random < 0.7)
                Factory({pos: this.position, tag: "HeartPickUp"});
            else if (random < 0.95)
                Factory({pos: this.position, tag: "GhostEnemy"});
            else
                Factory({pos: this.position, tag: "CoinPickUp", texture: 3});
        }
    }
});

Creator["Spikes"] = {
    create: function (info) {
        return new SpikesObject();
    },
    pool: function () {
        return game.scene.environment;
    },
    editor: function () {
        return new SpikesObject();
    }
};

Creator["Checkpoint"] = {
    create: function (info) {
        return new CheckpointObject();
    },
    pool: function () {
        return game.scene.environment;
    },
    editor: function () {
        return new CheckpointObject();
    }
};

Creator["Bridge"] = {
    create: function (info) {
        return new BridgeObject(info.pos);
    },
    pool: function () {
        return game.scene.enemies;
    },
    editor: function () {
        return new BridgeObject();
    }
};

Creator["Box"] = {
    create: function (info) {
        return new BoxObject();
    },
    pool: function () {
        return game.scene.ground;
    },
    editor: function () {
        return new BoxObject();
    }
};