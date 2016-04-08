var MovableObject = function (texturePool, textureIndex, mass) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "DynamicObject";
    this.rigidBody = new RigidBody(this, mass);
    this.animator = new Animator(this, null);
};

MovableObject.prototype = Object.create(GameObject.prototype);
MovableObject.prototype.constructor = MovableObject;

MovableObject.prototype.update = function () {
    // Update physics
    this.rigidBody.applyForce();
    // Animate sprite
    this.animator.animate();

    // Check for collisions
    var ground = game.scene.ground;
    for (var i = 0; i < ground.length; ++i) {
        if (this.position.x - ground[i].position.x <= 1 && this.position.y - ground[i].position.y <= 1)
            this.onCollision(ground[i]);
    }
};

MovableObject.prototype.onCollision = function (other) {
    var direction = this.collider.checkForCollision(other.collider);
    if (direction == "NONE") return;

    var tPos = this.position.get(),
        tCol = this.collider,
        oPos = other.position.get(),
        oCol = other.collider;

    switch (direction) {
        case "UP":
            this.rigidBody.onGround();
            this.position.set(tPos.x, oPos.y + (oCol.h + tCol.h) / 2);
            break;
        case "DOWN":
            this.position.set(tPos.x, oPos.y - (oCol.h + tCol.h) / 2);
            break;
        case "RIGHT":
            this.position.set(oPos.x + (oCol.w + tCol.w) / 2, tPos.y);
            break;
        case "LEFT":
            this.position.set(oPos.x - (oCol.w + tCol.w) / 2, tPos.y);
            break;
    }
};