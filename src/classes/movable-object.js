var MovableObject = function (texturePool, textureIndex, mass) {
    GameObject.call(this, texturePool, textureIndex);
    this.respawnPosition = new Vector(0, 0);
    this.rigidBody = new RigidBody(this, mass);
    this.animator = new Animator(this, game.textureManager.player);
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

MovableObject.prototype.move = function (direction) {
    if (direction == "stop") {
        this.rigidBody.speed.x = 0;
        return;
    }
    var moveSpeed = 0.004;
    if (direction == "left") {
        this.rigidBody.speed.x = -moveSpeed;
        this.scale.x = -1;
    } else if (direction == "right") {
        this.rigidBody.speed.x = moveSpeed;
        this.scale.x = 1;
    }
};

MovableObject.prototype.jump = function () {
    var jumpForce = 0.015;
    if (this.rigidBody.isGrounded) {
        this.rigidBody.isGrounded = false;
        this.rigidBody.force.y = jumpForce;
    } else {
        this.rigidBody.force.y = 0;
    }
};

MovableObject.prototype.checkForDeath = function() {
    if (this.position.y < -3 || this.position.y > 5) {
        this.respawn();
    }
};

MovableObject.prototype.respawn = function() {
    this.position.set(this.respawnPosition.x, this.respawnPosition.y);
    this.rigidBody.isGrounded = false;
    this.rigidBody.resetSpeedAndForce();
};