var MovableObject = function (texturePool, textureIndex, mass) {
    GameObject.call(this, texturePool, textureIndex);
    this.rigidBody = new RigidBody(this, mass);
};

MovableObject.prototype = Object.create(GameObject.prototype);
MovableObject.prototype.constructor = MovableObject;

MovableObject.prototype.update = function () {
    this.rigidBody.applyForce();

    var ground = game.scene.ground;
    for (var i = 0; i < ground.length; ++i) {
        if (this.position.x - ground[i].position.x <= 1 && this.position.y - ground[i].position.y <= 1)
            this.collider.checkForCollision(ground[i].collider);
    }
};

MovableObject.prototype.move = function (direction) {
    var moveDistance = 0.05;
    if (direction == "left") {
        this.position.x -= moveDistance;
        //Needs to be -1 when having a texture normally facing right
        this.scale.x = 1;
    } else if (direction == "right") {
        this.position.x += moveDistance;
        //Needs to be 1 when having a texture normally facing right
        this.scale.x = -1;
    }
};

MovableObject.prototype.jump = function () {
    var jumpForce = 0.015;
    if (this.rigidBody.isGrounded) {
        this.rigidBody.force.y = jumpForce;
        this.rigidBody.isGrounded = false;
    } else {
        this.rigidBody.force.y = 0;
    }
};

MovableObject.prototype.checkForDeath = function() {
    if (this.position.y < -3 || this.position.y > 6) {
        this.respawn();
    }
};

MovableObject.prototype.respawn = function() {
    var respawnPos = new Vector(0.0, 0.0);
    this.position.set(respawnPos.x, respawnPos.y);
    this.rigidBody.isGrounded = false;
    this.rigidBody.resetSpeedAndForce();
};