var PickUpObject = function(texturePool, textureIndex) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "PickUp";
    this.setScale(0.75, 0.75);
};

PickUpObject.prototype = Object.assign(Object.create(GameObject.prototype), {
    constructor: PickUpObject,
    pickup: function() {
        game.scene.removeObjectFromScene(game.scene.pickups, this.position);
    }
});

var CoinPickUpObject = function(value) {
    var index = 0;
    if (value == 2) index = 1;
    else if (value == 5) index = 2;
    PickUpObject.call(this, game.textureManager.items, index);
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