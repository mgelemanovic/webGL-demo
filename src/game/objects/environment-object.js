var EnvironmentObject = function (texturePool, textureIndex) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "Environment";
};

EnvironmentObject.prototype = Object.assign(Object.create(GameObject.prototype), {
    constructor: EnvironmentObject,
    interact: function (other, direction) {
        console.log(direction);
    }
});

var SpikesObject = function () {
    EnvironmentObject.call(this, game.textureManager.items, 7);
    this.tag = "Spikes";
    this.collider.h = 0.005;
};

SpikesObject.prototype = Object.assign(Object.create(EnvironmentObject.prototype), {
    constructor: SpikesObject,
    interact: function (other, direction) {
        if (other.rigidBody.speed.y < 0)
            other.hurt(1);
    }
});