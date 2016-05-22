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
    removeObjectFromScene: function (position) {
        var pool = [];
        pool.push(this.ground, this.decor, this.pickups, this.enemies, this.environment);
        for (var i = 0; i < pool.length; ++i) {
            for (var j = 0; j < pool[i].length; ++j) {
                if (Math.abs(position.x - pool[i][j].position.x) < 0.5 && Math.abs(position.y - pool[i][j].position.y) < 0.5)
                    pool[i].splice(j, 1);
            }
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