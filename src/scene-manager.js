var SceneManager = function() {
    this.cameraX = 0;
    this.cameraY = 0;

    this.lastTime = 0;
    this.elapsed = 0;
};

SceneManager.prototype.prepare = function(fovy, aspect, near, far) {
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    mat4.perspective(fovy, aspect, near, far, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [-this.cameraX, -this.cameraY, 0]);
};

SceneManager.prototype.render = function() {
    this.prepare(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0);

    for (var i = -5; i < 5; ++i) {
        background.position.x = i;
        background.draw();
    }

    player.draw();
};

SceneManager.prototype.update = function() {
    var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
        this.elapsed = timeNow - this.lastTime;

        player.move();
    }
    this.lastTime = timeNow;
};