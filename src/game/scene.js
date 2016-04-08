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
        for (var i = 0; i < sceneInfo.length; ++i) {
            var tmpScale = {x: 1, y: 1};
            var tmpTexture = 0;
            if (sceneInfo[i].scale)
                tmpScale = sceneInfo[i].scale;
            if (sceneInfo[i].texture)
                tmpTexture = sceneInfo[i].texture;
            self.addObjectToScene(objectPool, new GameObject(game.textureManager.ground, tmpTexture), sceneInfo[i].pos, tmpScale);
        }
    };

    //Ground info
    this.ground = [];
    fillUp(this, this.ground, sceneInfo.ground);

    //Decor info
    this.decor = [];
    fillUp(this, this.decor, sceneInfo.decor);
};

Scene.prototype.addObjectToScene = function (objectPool, newObject, position, scale) {
    objectPool.push(newObject);
    objectPool[objectPool.length - 1].setScale(scale.x, scale.y);
    objectPool[objectPool.length - 1].position.setv(position);
};

Scene.prototype.removeObjectFromScene = function (objectPool, index) {
    if (index > -1 && index < objectPool.length)
        objectPool.splice(index, 1);
};

Scene.prototype.checkForCoords = function (objectPool, coords) {
    for (var i = 0; i < this.ground.length; ++i) {
        if (coords.x == objectPool[i].position.x && coords.y == objectPool[i].position.y) {
            return i;
        }
    }
    return -1;
};

//Clears the scene, sets the perspective and moves the camera
Scene.prototype.prepare = function (fovy, aspect, near, far) {
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
};

Scene.prototype.render = function () {
    this.prepare(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0);

    var n = 0;

    this.background.draw();
    ++n;

    var drawPool = function(objectPool, camera) {
        for (var i = 0; i < objectPool.length; ++i) {
            if (Math.abs(objectPool[i].position.x - camera.x) < 6) {
                objectPool[i].draw();
                ++n;
            }
        }
    };
    drawPool(this.decor, this.camera);
    drawPool(this.ground, this.camera);

    this.player.draw();
    ++n;

    game.hud.updateLoadedObjects(n);
};

Scene.prototype.update = function () {
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
};