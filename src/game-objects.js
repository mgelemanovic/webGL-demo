//Game Object class definition
var GameObject = function(texture) {
    this.position = {
        x: 0.0,
        y: 0.0
    };
    this.scale = {
        x: 1.0,
        y: 1.0
    };
    this.rotation = 0.0;
    this.texture = texture;
};
GameObject.prototype.setPosition = function(newX, newY) {
    this.position.x = newX;
    this.position.y = newY;
};
GameObject.prototype.setScale = function(newX, newY) {
    this.scale.x = newX;
    this.scale.y = newY;
};
GameObject.prototype.setRotation = function(newRotation) {
    this.rotation = newRotation;
};
GameObject.prototype.draw = function() {
    setTexture(this.texture);
    mvPushMatrix();
    mat4.translate(mvMatrix, [this.position.x, this.position.y, drawDistance]);
    setMatrixUniforms();
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
    mvPopMatrix();
};

//MovableObject class definition
var MovableObject = function(texture, mass) {
    GameObject.call(this, texture);
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
MovableObject.prototype.move = function(elapsed) {
    var hAcc = this.force.x / this.mass;
    var vAcc = this.force.y / this.mass;
    var gAcc = -0.00001;

    player.speed.x += hAcc * elapsed;
    player.speed.y += (gAcc + vAcc) * elapsed;

    player.position.x += player.speed.x * elapsed;
    player.position.y += player.speed.y * elapsed;

    if (player.position.y < -1) {
        this.grounded = true;
        player.position.y = -1;
        player.speed.y = 0;
    }
};