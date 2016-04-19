var PickUpObject = function(texturePool, textureIndex) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "PickUp";
    this.value = 0;
};

PickUpObject.prototype = Object.assign(Object.create(GameObject.prototype), {
    constructor: PickUpObject,
    pickup: function() {
        game.score += this.value;
        game.scene.removeObjectFromScene(game.scene.pickups, this.position);
    }
});