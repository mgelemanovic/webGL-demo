var PickUpObject = function(texturePool, textureIndex) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "PickUp";
};

PickUpObject.prototype = Object.create(GameObject.prototype);
PickUpObject.prototype.constructor = PickUpObject;

PickUpObject.prototype.pickup = function() {
    game.score += 1;
    game.scene.removeObjectFromScene(game.scene.pickups, this.position);
};