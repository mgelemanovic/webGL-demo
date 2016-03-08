var GameObject = function (texture, drawDistance) {
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
    this.drawDistance = drawDistance;
};

GameObject.prototype.draw = function () {
    setTexture(this.texture);
    mvPushMatrix();
    mat4.translate(mvMatrix, [this.position.x, this.position.y, this.drawDistance]);
    mat4.scale(mvMatrix, [this.scale.x, this.scale.y, 1.0]);
    setMatrixUniforms();
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
    mvPopMatrix();
};