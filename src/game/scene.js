var Scene = function () {
    this.camera = new Vector(0.0, 0.0);
    this.range = 9;

    this.background = new GameObject(game.textureManager.background, 0);
    this.background.drawDistance = -0.5;
    this.background.scale.x = 1.19;
};

Scene.prototype = {
    init: function(sceneInfo) {
        var fillUp = function (sceneInfo) {
            if (!sceneInfo) return;
            for (var i = 0; i < sceneInfo.length; ++i)
                Factory(sceneInfo[i].tag, sceneInfo[i]);
        };
        this.ground = [];
        this.decor = [];
        this.pickups = [];
        this.environment = [];
        this.enemies = [];

        fillUp(sceneInfo.ground);
        fillUp(sceneInfo.decor);
        fillUp(sceneInfo.pickups);
        fillUp(sceneInfo.environment);
        fillUp(sceneInfo.enemies);

        game.player.respawnPosition.set(0, 0);
        game.player.respawn();
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

        if (!game.editor.isOn)      // Position the camera to follow the player or move it independently in editor mode
            this.camera.x = Math.max(4, game.player.position.x);
        this.background.position.x = this.camera.x;
        mat4.translate(mvMatrix, mvMatrix, [-this.camera.x, -this.camera.y, 0]);
    },
    render: function () {
        var drawPool = function (objectPool) {
            for (var i = 0; i < objectPool.length; ++i) {
                if (Math.abs(objectPool[i].position.x - game.scene.camera.x) < game.scene.range)
                    objectPool[i].render();
            }
        };
        this.prepare(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0);   // Prepare camera
        this.background.render();   // Background

        drawPool(this.decor);
        drawPool(this.ground);
        drawPool(this.pickups);
        drawPool(this.environment);
        drawPool(this.enemies);
    },
    update: function() {
        var updatePool = function (objectPool) {
            for (var i = 0; i < objectPool.length; ++i) {
                if (Math.abs(objectPool[i].position.x - game.scene.camera.x) < 1.5 * game.scene.range)
                    objectPool[i].update();
            }
        };

        updatePool(this.enemies);
        updatePool(this.environment);
    }
};