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
        game.textureManager.setActiveTexture(this.texturePool[this.textureIndex]);
        mvPushMatrix();
        mat4.translate(mvMatrix, mvMatrix, [this.position.x, this.position.y, this.drawDistance]);
        mat4.scale(mvMatrix, mvMatrix, [this.scale.x, this.scale.y, 1.0]);
        GL.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
        mvPopMatrix();
        if (this.debug)
            this.collider.render();
    },
    setScale: function (newX, newY) {
        if (newX > 1) newX = 1;
        if (newY > 1) newY = 1;
        this.scale.set(newX, newY);
        this.collider.w = Math.abs(newX);
        this.collider.h = Math.abs(newY);
    },
    writeData: function () {
        var data = {
            pos: {
                x: this.position.x,
                y: this.position.y
            }
        };
        data.texture = this.textureIndex;
        if (this.tag != "GameObject") {
            data.tag = this.tag;
        }
        return data;
    }
};

Creator["GameObject"] = {
    create: function (info) {
        return new GameObject(game.textureManager.ground, info.texture);
    },
    pool: function () {
        return game.scene.ground;
    },
    editor: function () {
        var objects = [];
        for (var i = 0; i < 16; ++i)
            objects.push(new GameObject(game.textureManager.ground, i));
        return objects;
    }
};

Creator["DecorObject"] = {
    create: function (info) {
        var object = new GameObject(game.textureManager.ground, info.texture);
        object.tag = "DecorObject";
        return object;
    },
    pool: function () {
        return game.scene.decor;
    },
    editor: function () {
        var objects = [];
        for (var i = 16; i < 23; ++i) {
            var object = new GameObject(game.textureManager.ground, i);
            object.tag = "DecorObject";
            objects.push(object);
        }
        return objects;
    }
};