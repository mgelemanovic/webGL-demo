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
        if (other.speed.y < 0)
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

Creator["Checkpoint"] = {
    create: function (info) {
        return new CheckpointObject();
    },
    pool: function () {
        return game.scene.environment;
    }
};

Creator["Spikes"] = {
    create: function (info) {
        return new SpikesObject();
    },
    pool: function () {
        return game.scene.environment;
    }
};