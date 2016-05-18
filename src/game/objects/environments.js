var EnvironmentObject = function (texturePool, textureIndex) {
    RigidBody.call(this, texturePool, textureIndex);
    this.tag = "Environment";
};

EnvironmentObject.prototype = Object.assign(Object.create(RigidBody.prototype), {
    constructor: EnvironmentObject,
    interact: function (other, direction) {
    }
});

var SpikesObject = function () {
    EnvironmentObject.call(this, game.textureManager.items, 8);
    this.tag = "Spikes";
    this.collider.offset.y = -0.25;
    this.collider.h = 0.5;
};

SpikesObject.prototype = Object.assign(Object.create(EnvironmentObject.prototype), {
    constructor: SpikesObject,
    update: function () {
    },
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

        if (this.position.y < -4) {
            game.scene.removeObjectFromScene(game.scene.enemies, this.position);
            this.position.setv(this.spawn);
            game.scene.removed.push(this);
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