var EnvironmentObject = function (texturePool, textureIndex) {
    MovableObject.call(this, texturePool, textureIndex);
    this.tag = "Environment";
};

EnvironmentObject.prototype = Object.assign(Object.create(MovableObject.prototype), {
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
    update: function() {},
    interact: function (other, direction) {
        if (other.rigidBody.speed.y < 0)
            other.hurt(1);
    }
});

var CheckpointObject = function () {
    EnvironmentObject.call(this, game.textureManager.items, 12);
    this.tag = "Checkpoint";
    this.animator = new Animator(30);
    this.textures = [game.textureManager.items[12], game.textureManager.items[13]];
};

CheckpointObject.prototype = Object.assign(Object.create(EnvironmentObject.prototype), {
    constructor: CheckpointObject,
    update: function() {
        this.animator.animate(this, this.textures);
    },
    interact: function (other, direction) {
        other.respawnPosition = this.position;
    }
});