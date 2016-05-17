var Camera = function () {
    this.position = new Vector(0, 0);
    this.range = new Vector(9, 5);

    this.background = new GameObject(game.textureManager.background, 0);
    this.background.drawDistance = -0.5;
    this.background.scale.x = 1.19;
    this.background.position = this.position;

    this.vertical = false;
};

Camera.prototype = {
    followPlayer: function () {
        this.position.x = Math.max(4, game.player.position.x);
        if (this.vertical)
            this.position.y = Math.max(0, game.player.position.y - 2);
    },
    prepareScene: function () {
        GL.clear(GL.COLOR_BUFFER_BIT);

        mat4.perspective(pMatrix, 45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0);
        GL.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);

        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, [-this.position.x, -this.position.y, 0]);

        this.background.render();
    },
    inRange: function (object, modifier) {
        return (Math.abs(object.position.x - this.position.x) < modifier * this.range.x) &&
            (Math.abs(object.position.y - this.position.y) < modifier * this.range.y);
    }
};