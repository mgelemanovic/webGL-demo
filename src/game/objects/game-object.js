var GameObject = function (texturePool, textureIndex) {
    this.tag = "GameObject";

    this.position = new Vector(0.0, 0.0);
    this.drawDistance = game.drawDistance;
    this.scale = new Vector(1.0, 1.0);

    this.texturePool = texturePool;
    this.textureIndex = textureIndex;

    this.collider = new Collider(this, 1, 1);
    this.debug = false;
};

GameObject.prototype = {
    render: function () {
        if (this.debug)
            this.collider.render();
        game.textureManager.setActiveTexture(this.texturePool[this.textureIndex]);
        mvPushMatrix();
        mat4.translate(mvMatrix, mvMatrix, [this.position.x, this.position.y, this.drawDistance]);
        mat4.scale(mvMatrix, mvMatrix, [this.scale.x, this.scale.y, 1.0]);
        GL.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
        mvPopMatrix();
    },
    setScale: function (newX, newY) {
        if (newX > 1) newX = 1;
        if (newY > 1) newY = 1;
        this.scale.set(newX, newY);
        this.collider.w = Math.abs(newX);
        this.collider.h = Math.abs(newY);
    },
    writeData: function() {
        var data = {
            pos: {
                x: this.position.x,
                y: this.position.y
            }
        };
        data.texture = this.textureIndex;
        if (this.scale.x != 1.0 || this.scale.y != 1.0) {
            data.scale = {
                x: this.scale.x,
                y: this.scale.y
            };
        }
        if (this.tag != "GameObject") {
            data.tag = this.tag;
        }
        return data;
    }
};

creator["GameObject"] = {
    create: function (info) {
        var textureIndex = 0;
        if (info.texture)
            textureIndex = info.texture;
        return new GameObject(game.textureManager.ground, textureIndex);
    },
    pool: function () {
        return game.scene.ground;
    }
};

creator["DecorObject"] = {
    create: function (info) {
        var textureIndex = 0;
        if (info.texture)
            textureIndex = info.texture;
        var object = new GameObject(game.textureManager.ground, textureIndex);
        object.tag = "DecorObject";
        return object;
    },
    pool: function () {
        return game.scene.decor;
    }
};