var PickUpObject = function (texturePool, textureIndex) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "PickUp";
    this.setScale(0.75, 0.75);
};

PickUpObject.prototype = Object.assign(Object.create(GameObject.prototype), {
    constructor: PickUpObject,
    interact: function (other, direction) {
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
    interact: function (other, direction) {
        PickUpObject.prototype.interact.call(this, other, direction);
        game.score += this.value;
    }
});

var StarPickUpObject = function () {
    PickUpObject.call(this, game.textureManager.items, 3);
    this.tag = "StarPickUp";
};

StarPickUpObject.prototype = Object.assign(Object.create(PickUpObject.prototype), {
    constructor: StarPickUpObject,
    interact: function (other, direction) {
        PickUpObject.prototype.interact.call(this, other, direction);
        game.hud.menuContent('victory');
        game.nextLevel();
    }
});