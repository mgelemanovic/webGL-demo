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
    EnvironmentObject.call(this, game.textureManager.items, 7);
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
    EnvironmentObject.call(this, game.textureManager.items, 12);
    this.tag = "Checkpoint";
    this.animator = new Animator(30);
};

CheckpointObject.prototype = Object.assign(Object.create(EnvironmentObject.prototype), {
    constructor: CheckpointObject,
    update: function () {
        this.animator.animate(this, game.textureManager.items.slice(12, 14));
    },
    interact: function (other, direction) {
        other.respawnPosition = this.position;
    }
});