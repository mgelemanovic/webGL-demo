var PickUpObject = function(texturePool, textureIndex) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "PickUp";
};

PickUpObject.prototype = Object.assign(Object.create(GameObject.prototype), {
    constructor: PickUpObject,
    pickup: function() {
        game.scene.removeObjectFromScene(game.scene.pickups, this.position);
    }
});

var CoinPickUpObject = function(value) {
    PickUpObject.call(this, game.textureManager.hud, 14);
    this.tag = "CoinPickUp";
    this.value = value;
};

CoinPickUpObject.prototype = Object.assign(Object.create(PickUpObject.prototype), {
    constructor: CoinPickUpObject,
    pickup: function() {
        PickUpObject.prototype.pickup.call(this);
        game.score += this.value;
    }
});