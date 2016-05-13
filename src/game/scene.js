var Scene = function (sceneInfo) {
    this.camera = new Vector(0.0, 0.0);
    this.range = 9;

    this.lastTime = 0;
    this.elapsed = 0;

    var fillUp = function (objectPool, sceneInfo) {
        if (!sceneInfo) return;
        for (var i = 0; i < sceneInfo.length; ++i)
            objectPool.push(Factory.create(sceneInfo[i].tag, sceneInfo[i]));
    };

    this.background = Factory.createBackground();
    this.player = new Player(50);
    if (sceneInfo.respawn)
        this.player.respawnPosition.setv(sceneInfo.respawn);
    this.player.respawn();

    this.ground = [];
    this.decor = [];
    this.pickups = [];
    this.environment = [];
    this.enemies = [];

    fillUp(this.ground, sceneInfo.ground);
    fillUp(this.decor, sceneInfo.decor);
    fillUp(this.pickups, sceneInfo.pickups);
    fillUp(this.environment, sceneInfo.environment);
    fillUp(this.enemies, sceneInfo.enemies);
};

Scene.prototype = {
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

        if (!game.editor.isOn)      // Position the camera to follow the player or move it independently in editor mode
            this.camera.x = Math.max(4, this.player.position.x);
        this.background.position.x = this.camera.x;
        mat4.translate(mvMatrix, mvMatrix, [-this.camera.x, -this.camera.y, 0]);
    },
    render: function () {
        var drawPool = function (objectPool) {
            for (var i = 0; i < objectPool.length; ++i) {
                if (Math.abs(objectPool[i].position.x - game.scene.camera.x) < game.scene.range)
                    objectPool[i].draw();
            }
        };
        this.prepare(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0);   // Prepare camera
        this.background.draw();   // Background

        drawPool(this.decor);
        drawPool(this.ground);
        drawPool(this.pickups);
        drawPool(this.environment);
        drawPool(this.enemies);
    },
    update: function () {
        var timeNow = new Date().getTime();
        if (this.lastTime != 0) {
            this.elapsed = timeNow - this.lastTime;
            // Time step correction
            if (this.elapsed > 60) this.elapsed = 60;

            this.player.update();
            // Update enemies, maybe even environment
        }
        this.lastTime = timeNow;
    }
};