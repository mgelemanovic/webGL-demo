var RigidBody = function (attachedTo, mass) {
    this.attachedTo = attachedTo;
    this.mass = mass;
    this.speed = new Vector(0.0, 0.0);
    this.force = new Vector(0.0, 0.0);
    this.isGrounded = false;
};

RigidBody.prototype.applyForce = function () {
    var elapsed = game.scene.elapsed,
        gAcc = -0.00001,    // Kinda low? Maybe?
        acc = new Vector(this.force.x / this.mass, this.force.y / this.mass);
    this.force.set(0, 0);    // Turn off forces

    this.speed.add(acc.x * elapsed, (gAcc + acc.y) * elapsed);

    // Vertical speed upper limitation
    var upperLimit = 0.005;
    if (this.speed.y > upperLimit)
        this.speed.y = upperLimit;

    this.attachedTo.position.add(this.speed.x * elapsed, this.speed.y * elapsed);
};

RigidBody.prototype.onGround = function () {
    this.isGrounded = true;
    this.resetSpeedAndForce();
};

RigidBody.prototype.resetSpeedAndForce = function () {
    this.speed.set(0.0, 0.0);
    this.force.set(0.0, 0.0);
};

var Collider = function (attachedTo, width, height) {
    this.attachedTo = attachedTo;
    this.w = width;
    this.h = height;
};

Collider.prototype.checkForCollision = function (other) {
    var tPos = this.attachedTo.position.get(),
        oPos = other.attachedTo.position.get();

    if (tPos.x - this.w / 2 < oPos.x + other.w / 2 &&
        tPos.x + this.w / 2 > oPos.x - other.w / 2 &&
        tPos.y - this.h / 2 < oPos.y + other.h / 2 &&
        tPos.y + this.h / 2 > oPos.y - other.h / 2) {

        var deltaX = tPos.x - oPos.x,
            deltaY = tPos.y - oPos.y;

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY > 0)
                return "UP";
            else
                return "DOWN";
        } else {
            if (deltaX > 0)
                return "RIGHT";
            else
                return "LEFT";
        }
    }
    return "NONE";
};