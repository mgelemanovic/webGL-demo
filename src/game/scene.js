var Scene = function (sceneInfo) {
    this.camera = new Vector(0.0, 0.0);

    this.lastTime = 0;
    this.elapsed = 0;

    //Background info
    this.background = new GameObject(game.textureManager.background, 0);
    this.background.drawDistance = -0.5;

    //Player info
    this.player = new Player(game.textureManager.player.idle, 0, 50);
    if (sceneInfo.respawn)
        this.player.respawnPosition.setv(sceneInfo.respawn);
    this.player.respawn();

    var fillUp = function (self, objectPool, sceneInfo) {
        if (!sceneInfo) return;
        for (var i = 0; i < sceneInfo.length; ++i) {
            var texture = 0,
                object = GameObject,
                texturePool = game.textureManager.ground;
            if (sceneInfo[i].texture)
                texture = sceneInfo[i].texture;
            if (sceneInfo[i].tag)
                if (sceneInfo[i].tag == "PickUp") {
                    object = PickUpObject;
                    texturePool = game.textureManager.hud;
                }
            var createdObject = new object(texturePool, texture);
            if (sceneInfo[i].tag == "PickUp") {
                createdObject.value = 5;
            }
            self.addObjectToScene(objectPool, createdObject, sceneInfo[i].pos);
            if (sceneInfo[i].scale)
                objectPool[i].scale.set(sceneInfo[i].scale.x, sceneInfo[i].scale.y);
        }
    };

    //Ground info
    this.ground = [];
    fillUp(this, this.ground, sceneInfo.ground);

    //Decor info
    this.decor = [];
    fillUp(this, this.decor, sceneInfo.decor);

    this.pickups = [];
    fillUp(this, this.pickups, sceneInfo.coins);
};

Scene.prototype = {
    addObjectToScene: function (objectPool, newObject, position) {
        objectPool.push(newObject);
        objectPool[objectPool.length - 1].position.setv(position);
    },
    removeObjectFromScene: function (objectPool, coords) {
        for (var i = 0; i < objectPool.length; ++i) {
            if (coords.x == objectPool[i].position.x && coords.y == objectPool[i].position.y) {
                objectPool.splice(i, 1);
            }
        }
    },
    //Clears the scene, sets the perspective and moves the camera
    prepare: function (fovy, aspect, near, far) {
        GL.clear(GL.COLOR_BUFFER_BIT);

        mat4.perspective(pMatrix, fovy, aspect, near, far);
        GL.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        mat4.identity(mvMatrix);

        // Position the camera to follow the player or move it independently in editor mode
        if (!game.editor.isOn) {
            this.camera.x = this.player.position.x;
        }
        this.background.position.x = this.camera.x;
        mat4.translate(mvMatrix, mvMatrix, [-this.camera.x, -this.camera.y, 0]);
    },
    render: function () {
        this.prepare(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0);

        var n = 0;

        this.background.draw();
        ++n;

        var drawPool = function (objectPool) {
            for (var i = 0; i < objectPool.length; ++i) {
                if (Math.abs(objectPool[i].position.x - game.scene.camera.x) < 6) {
                    objectPool[i].draw();
                    ++n;
                }
            }
        };
        drawPool(this.decor);
        drawPool(this.ground);
        drawPool(this.pickups);

        if (!game.editor.isOn) {
            this.player.draw();
            ++n;
        }

        game.hud.updateLoadedObjects(n);
    },
    update: function () {
        var timeNow = new Date().getTime();
        if (this.lastTime != 0) {
            this.elapsed = timeNow - this.lastTime;
            // Time step correction
            if (this.elapsed > 60) this.elapsed = 60;

            this.player.update();
        }
        this.lastTime = timeNow;

        //Check for death
        this.player.checkForDeath();
    }
};