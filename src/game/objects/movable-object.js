var MovableObject = function (texturePool, textureIndex, mass) {
    GameObject.call(this, texturePool, textureIndex);
    this.rigidBody = new RigidBody(this, mass);
    this.animator = new Animator(this, null);
};

MovableObject.prototype = Object.create(GameObject.prototype);
MovableObject.prototype.constructor = MovableObject;

MovableObject.prototype.update = function () {
    this.rigidBody.applyForce();
    this.animator.animate();

    var ground = game.scene.ground;
    for (var i = 0; i < ground.length; ++i) {
        if (this.position.x - ground[i].position.x <= 1 && this.position.y - ground[i].position.y <= 1)
            this.collider.checkForCollision(ground[i].collider);
    }
};