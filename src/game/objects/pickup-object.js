var PickUpObject = function (texturePool, textureIndex) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "PickUp";
    this.setScale(0.75, 0.75);
};

PickUpObject.prototype = Object.assign(Object.create(GameObject.prototype), {
    constructor: PickUpObject,
    pickup: function () {
        game.scene.removeObjectFromScene(game.scene.pickups, this.position);
    }
});

var CoinPickUpObject = function (index) {
    var value = 1;
    if (index == 1) value = 2;
    else if (index == 2) value = 5;
    PickUpObject.call(this, game.textureManager.items, index);
    this.tag = "CoinPickUp";
    this.value = value;
};

CoinPickUpObject.prototype = Object.assign(Object.create(PickUpObject.prototype), {
    constructor: CoinPickUpObject,
    pickup: function () {
        PickUpObject.prototype.pickup.call(this);
        game.score += this.value;
    }
});

var StarPickUpObject = function () {
    PickUpObject.call(this, game.textureManager.items, 3);
    this.tag = "StarPickUp";
};

StarPickUpObject.prototype = Object.assign(Object.create(PickUpObject.prototype), {
    constructor: StarPickUpObject,
    pickup: function () {
        PickUpObject.prototype.pickup.call(this);
        alert("Great job!\nYour score: " + game.score);
        game.nextLevel();
    }
});