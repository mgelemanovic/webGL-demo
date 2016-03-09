var SceneManager = function () {
    this.cameraX = 0;
    this.cameraY = 0;

    this.lastTime = 0;
    this.elapsed = 0;

    //Something to hold info on scene
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

    ground.draw();
    player.draw();
};

SceneManager.prototype.update = function () {
    var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
        this.elapsed = timeNow - this.lastTime;

        player.move();
    }
    this.lastTime = timeNow;

    //Check for death
    if (player.position.y < -4) {
        player.position.x = 0;
        player.position.y = 0;
        player.rigidBody.isGrounded = false;
        player.rigidBody.speedY = 0;
    }
};