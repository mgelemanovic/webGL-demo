var MovableObject = function (texture, drawDistance, mass) {
    GameObject.call(this, texture, drawDistance);
    this.speed = {
        x: 0.0,
        y: 0.0
    };
    this.mass = mass;
    this.force = {
        x: 0.0,
        y: 0.0
    };
    this.grounded = false;
};

MovableObject.prototype = Object.create(GameObject.prototype);
MovableObject.prototype.constructor = MovableObject;

MovableObject.prototype.move = function () {
    //Apply vertical force + gravity
    var gAcc = -0.00001;
    var vAcc = this.force.y / this.mass;
    this.speed.y += (gAcc + vAcc) * scene.elapsed;
    this.position.y += this.speed.y * scene.elapsed;
    if (this.position.y < -1) {
        this.grounded = true;
        this.position.y = -1;
        this.speed.y = 0;
    }

    //Apply horizontal force
    var hAcc = this.force.x / this.mass;
    this.speed.x += hAcc * scene.elapsed;
    this.position.x += this.speed.x * scene.elapsed;
};