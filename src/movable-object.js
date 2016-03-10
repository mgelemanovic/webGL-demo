var MovableObject = function (texture, mass) {
    GameObject.call(this, texture);
    this.rigidBody = new RigidBody(this, mass);
};

MovableObject.prototype = Object.create(GameObject.prototype);
MovableObject.prototype.constructor = MovableObject;

MovableObject.prototype.update = function () {
    this.rigidBody.applyForce();
    for (var i = 0; i < scene.ground.length; ++i) {
        if (this.position.x - scene.ground[i].position.x <= 1 && this.position.y - scene.ground[i].position.y <= 1)
            this.collider.checkForCollision(scene.ground[i].collider);
    }
};

MovableObject.prototype.move = function(direction) {
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

MovableObject.prototype.jump = function() {
    var jumpForce = 0.015;
    if (this.rigidBody.isGrounded) {
        this.rigidBody.forceY = jumpForce;
        this.rigidBody.isGrounded = false;
    } else {
        this.rigidBody.forceY = 0;
    }
};