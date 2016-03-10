var SceneManager = function () {
    this.cameraX = 0;
    this.cameraY = 0;

    this.lastTime = 0;
    this.elapsed = 0;

    //Something to hold info on scene
    this.player = new MovableObject(textureManager.player, 50);
    this.player.collider.w = 0.5;
    this.player.collider.h = 0.55;

    this.ground = [];
    this.addObjectToScene(this.ground, new GameObject(textureManager.ground), {x: 0, y: -2});
    this.addObjectToScene(this.ground, new GameObject(textureManager.ground), {x: 1, y: -2});
    this.addObjectToScene(this.ground, new GameObject(textureManager.ground), {x: -1, y: -2});
    this.addObjectToScene(this.ground, new GameObject(textureManager.ground), {x: -1, y: -1});
    this.addObjectToScene(this.ground, new GameObject(textureManager.ground), {x: 1, y: -1 - 0.35});
    this.ground[4].setScale(1, 0.3);
};

SceneManager.prototype.addObjectToScene = function (objectPool, newObject, position) {
    objectPool.push(newObject);
    objectPool[objectPool.length - 1].setPosition(position.x, position.y);
};

//Clears the scene, sets the perspective and moves the camera
SceneManager.prototype.prepare = function (fovy, aspect, near, far) {
    GL.clear(GL.COLOR_BUFFER_BIT);

    mat4.perspective(fovy, aspect, near, far, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [-this.cameraX, -this.cameraY, 0]);
};

SceneManager.prototype.render = function () {
    this.prepare(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0);

    for (var i = 0; i < scene.ground.length; ++i) {
        this.ground[i].draw();
    }
    this.player.draw();
};

SceneManager.prototype.update = function () {
    var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
        this.elapsed = timeNow - this.lastTime;

        this.player.update();
    }
    this.lastTime = timeNow;

    //Check for death
    if (this.player.position.y < -4) {
        this.player.position.x = 0;
        this.player.position.y = 0;
        this.player.rigidBody.isGrounded = false;
        this.player.rigidBody.speedY = 0;
    }
};