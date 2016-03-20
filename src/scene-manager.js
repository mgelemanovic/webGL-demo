var SceneManager = function (sceneInfo) {
    this.camera = new Vector(0.0, 0.0);

    this.lastTime = 0;
    this.elapsed = 0;

    //Background info
    this.background = new GameObject(game.textureManager.background, 0);
    this.background.drawDistance = -0.5;

    //Player info
    this.player = new MovableObject(game.textureManager.player, 0, 50);
    this.player.collider.w = 0.5;
    this.player.collider.h = 0.55;

    //Ground info
    this.ground = [];
    for (var i = 0; i < sceneInfo.ground.length; ++i) {
        var tmpScale = {x: 1, y: 1};
        var tmpTexture = 0;
        if (sceneInfo.ground[i].scale)
            tmpScale = sceneInfo.ground[i].scale;
        if (sceneInfo.ground[i].texture)
            tmpTexture = sceneInfo.ground[i].texture;
        this.addObjectToScene(this.ground, new GameObject(game.textureManager.ground, tmpTexture), sceneInfo.ground[i].pos, tmpScale);
    }
};

SceneManager.prototype.addObjectToScene = function (objectPool, newObject, position, scale) {
    objectPool.push(newObject);
    objectPool[objectPool.length - 1].setScale(scale.x, scale.y);
    objectPool[objectPool.length - 1].position.set(position.x, position.y /*- (0.5 - scale.y / 2)*/);
};

SceneManager.prototype.removeObjectFromScene = function (objectPool, index) {
    if (index > -1 && index < objectPool.length)
        objectPool.splice(index, 1);
};

SceneManager.prototype.checkForCoords = function (objectPool, coords) {
    for (var i = 0; i < this.ground.length; ++i) {
        if (coords.x == objectPool[i].position.x && coords.y == objectPool[i].position.y) {
            return i;
        }
    }
    return -1;
};

//Clears the scene, sets the perspective and moves the camera
SceneManager.prototype.prepare = function (fovy, aspect, near, far) {
    GL.clear(GL.COLOR_BUFFER_BIT);

    mat4.perspective(pMatrix, fovy, aspect, near, far);
    GL.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    mat4.identity(mvMatrix);

    // Position the camera to follow the player or move it independently in editor mode
    if (!game.editor.isOn)
        this.camera.x = this.player.position.x;
    this.background.position.x = this.camera.x;
    mat4.translate(mvMatrix, mvMatrix, [-this.camera.x, -this.camera.y, 0]);
};

SceneManager.prototype.render = function () {
    this.prepare(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0);

    var n = 0;

    this.background.draw();
    ++n;

    for (var i = 0; i < this.ground.length; ++i) {
        if (Math.abs(this.ground[i].position.x - this.camera.x) < 5) {
            this.ground[i].draw();
            ++n;
        }
    }

    this.player.draw();
    ++n;

    game.hud.updateLoadedObjects(n);
};

SceneManager.prototype.update = function () {
    var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
        this.elapsed = timeNow - this.lastTime;

        this.player.update();
    }
    this.lastTime = timeNow;

    //Check for death
    this.player.checkForDeath();
};