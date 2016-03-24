var GameObject = function (texturePool, textureIndex) {
    this.position = new Vector(0.0, 0.0);
    this.drawDistance = -5.5;
    this.scale = new Vector(1.0, 1.0);
    this.texturePool = texturePool;
    this.textureIndex = textureIndex;
    this.collider = new Collider(this, 1, 1);
};

GameObject.prototype.setScale = function (newX, newY) {
    if (newX > 1) newX = 1;
    if (newY > 1) newY = 1;
    this.scale.set(newX, newY);
    this.collider.w = Math.abs(newX);
    this.collider.h = Math.abs(newY);
};

GameObject.prototype.draw = function () {
    game.textureManager.setTexture(this.texturePool[this.textureIndex]);
    mvPushMatrix();
    mat4.translate(mvMatrix, mvMatrix, [this.position.x, this.position.y, this.drawDistance]);
    mat4.scale(mvMatrix, mvMatrix, [this.scale.x, this.scale.y, 1.0]);
    GL.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
    mvPopMatrix();
};