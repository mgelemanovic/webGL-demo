var MovableObject = function (texture, mass) {
    GameObject.call(this, texture);
    this.rigidBody = new RigidBody(this, mass);
};

MovableObject.prototype = Object.create(GameObject.prototype);
MovableObject.prototype.constructor = MovableObject;

MovableObject.prototype.move = function () {
    this.rigidBody.applyForce();
    this.collider.checkForCollision(ground.collider);
};