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
    removeObjectFromScene: function (pool, position) {
        for (var i = 0; i < pool.length; ++i) {
            if (Math.abs(position.x - pool[i].position.x) < 0.3 && Math.abs(position.y - pool[i].position.y) < 0.3)
                pool.splice(i, 1);
        }
    },
    drawPool: function (pool) {
        for (var i = 0; i < pool.length; ++i) {
            if (this.camera.inRange(pool[i], 1))
                pool[i].render();
        }
    },
    updatePool: function (pool) {
        for (var i = 0; i < pool.length; ++i) {
            if (this.camera.inRange(pool[i], 1.5))
                pool[i].update();
        }
    },
    togglePoolCollider: function (pool) {
        for (var i = 0; i < pool.length; ++i)
            pool[i].debug = !pool[i].debug;

        this.render();
        game.player.render();
        game.hud.render();
    },
    render: function () {
        this.camera.prepareScene();

        this.drawPool(this.decor);
        this.drawPool(this.ground);
        this.drawPool(this.pickups);
        this.drawPool(this.environment);
        this.drawPool(this.enemies);
    },
    update: function () {
        this.updatePool(this.enemies);
        this.updatePool(this.environment);
    }
};