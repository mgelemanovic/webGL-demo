var Scene = function () {
    this.camera = new Camera();
};

Scene.prototype = {
    init: function (sceneInfo) {
        if (!sceneInfo) return;

        this.ground = [];
        this.decor = [];
        this.pickups = [];
        this.environment = [];
        this.enemies = [];
        this.removed = [];

        for (var i = 0; i < sceneInfo.length; ++i)
            Factory(sceneInfo[i].tag, sceneInfo[i]);

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
    render: function () {
        this.camera.prepareScene();

        var drawPool = function (objectPool) {
            for (var i = 0; i < objectPool.length; ++i) {
                if (game.scene.camera.inRange(objectPool[i], 1))
                    objectPool[i].render();
            }
        };

        drawPool(this.decor);
        drawPool(this.ground);
        drawPool(this.pickups);
        drawPool(this.environment);
        drawPool(this.enemies);
    },
    update: function () {
        var updatePool = function (objectPool) {
            for (var i = 0; i < objectPool.length; ++i) {
                if (game.scene.camera.inRange(objectPool[i], 1.5))
                    objectPool[i].update();
            }
        };

        updatePool(this.enemies);
        updatePool(this.environment);
    }
};