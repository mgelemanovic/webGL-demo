var RigidBody = function(attachedTo, mass) {
    this.attachedTo = attachedTo;
    this.mass = mass;
    this.speedX = 0.0;
    this.speedY = 0.0;
    this.forceX = 0.0;
    this.forceY = 0.0;
    this.isGrounded = false;
};

RigidBody.prototype.applyForce = function() {
    var gAcc = -0.00001;    // Kinda low? Maybe?
    var vAcc = this.forceY / this.mass;
    var hAcc = this.forceX / this.mass;

    this.speedY += (gAcc + vAcc) * scene.elapsed;
    this.speedX += hAcc * scene.elapsed;

    var bodyPosition = this.attachedTo.getPosition();
    this.attachedTo.setPosition(bodyPosition.x + this.speedX * scene.elapsed, bodyPosition.y + this.speedY * scene.elapsed);
};

RigidBody.prototype.onGround = function() {
    this.isGrounded = true;
    this.speedY = 0.0;
};

var Collider = function(attachedTo, width, height) {
    this.attachedTo = attachedTo;
    this.w = width;
    this.h = height;
};

Collider.prototype.checkForCollision = function(other) {
    var actorPos = this.attachedTo.getPosition();
    var otherPos = other.attachedTo.getPosition();

    if (actorPos.x - this.w/2 < otherPos.x + other.w/2 &&
        actorPos.x + this.w/2 > otherPos.x - other.w/2 &&
        actorPos.y - this.h/2 < otherPos.y + other.h/2 &&
        actorPos.y + this.h/2 > otherPos.y - other.h/2) {
        // collision detected!
        this.attachedTo.rigidBody.onGround();
        this.attachedTo.setPosition(actorPos.x, otherPos.y + other.h);
    }
};