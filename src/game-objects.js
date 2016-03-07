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
var MovableObject = function(texture) {
    GameObject.call(this, texture);
    this.speed = {
        x: 0.0,
        y: 0.0
    };
};
MovableObject.prototype = Object.create(GameObject.prototype);
MovableObject.prototype.constructor = MovableObject;
MovableObject.prototype.setSpeed = function(newX, newY) {
    this.speed.x = newX;
    this.speed.y = newY;
};