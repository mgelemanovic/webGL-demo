var GameObject = function (texture, drawDistance) {
    //Position, scale are kinda weird
    this.position = {
        x: 0.0,
        y: 0.0
    };
    this.scale = {
        x: 1.0,
        y: 1.0
    };
    //this.rotation = 0.0;
    this.texture = texture;
    this.drawDistance = drawDistance;   // Is this weird???
    this.collider = {   //???????
        x: this.position.x - squareVertexDistance / 2,
        y: this.position.y + squareVertexDistance / 2,
        w: squareVertexDistance,
        h: 2 * squareVertexDistance,
        updateCollider: function (pos) {    //This sucks ass
            this.x = pos.x - squareVertexDistance / 2;
            this.y = pos.y - squareVertexDistance / 2;
        }
    }
};

GameObject.prototype.draw = function () {
    setTexture(this.texture);
    mvPushMatrix();
    //Rotations are missing, shall I even implement it?
    mat4.translate(mvMatrix, [this.position.x, this.position.y, this.drawDistance]);
    mat4.scale(mvMatrix, [this.scale.x, this.scale.y, 1.0]);
    setMatrixUniforms();
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
    mvPopMatrix();
};