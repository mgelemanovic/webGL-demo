var GameObject = function (texture) {
    //Position and scale are kinda weird
    this.position = {
        x: 0.0,
        y: 0.0
    };
    this.drawDistance = -5;
    this.scale = {
        x: 1.0,
        y: 1.0
    };
    //this.rotation = 0.0;
    this.texture = texture;
    this.collider = new Collider(this, 1, 1);
};

GameObject.prototype.setPosition = function (newX, newY) {
    this.position.x = newX;
    this.position.y = newY;
};

GameObject.prototype.getPosition = function () {
    return {
        x: this.position.x,
        y: this.position.y
    }
};

GameObject.prototype.setScale = function (newX, newY) {
    this.scale.x = newX;
    this.scale.y = newY;
    this.collider.w = Math.abs(newX);
    this.collider.h = Math.abs(newY);
};

GameObject.prototype.draw = function () {
    setTexture(this.texture);
    mvPushMatrix();
    //Rotations are missing, shall I even implement it?
    mat4.translate(mvMatrix, mvMatrix, [this.position.x, this.position.y, this.drawDistance]);
    mat4.scale(mvMatrix, mvMatrix, [this.scale.x, this.scale.y, 1.0]);
    setMatrixUniforms();
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
    mvPopMatrix();
};