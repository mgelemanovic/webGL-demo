var game;

var Game = function () {
    webGLStart();
    this.textureManager = new TextureManager();

    this.waitToLoad = 0;
    this.drawDistance = -7;
    this.score = 0;

    this.currentLevel = 0;
    this.numberOfLevels = 2;

    this.lastTime = 0;
    this.elapsed = 0;
};

Game.prototype = {
    start: function () {
        document.getElementById("startMenu").style.visibility = "hidden";

        this.hud = new HUD();
        this.inputManager = new Input();
        this.editor = new Editor();

        // Player creation
        this.player = new Player();
        // First level loading
        this.loadScene("0");

        gameLoop();
    },
    tick: function () {
        var timeNow = new Date().getTime();
        if (this.lastTime != 0) {
            this.elapsed = timeNow - this.lastTime;
            // Time step correction
            if (this.elapsed > 30) this.elapsed = 30;
        }
        this.lastTime = timeNow;
    },
    loop: function () {
        this.inputManager.handleInput();    // Handle player input

        this.player.update();               // Update player
        this.scene.update();                // Update scene

        this.scene.render();                // Render game world
        this.player.render();               // Render player
        this.hud.render();                  // Render in-game HUD
    },
    nextLevel: function () {
        this.currentLevel = (this.currentLevel + 1) % this.numberOfLevels;
        this.loadScene(this.currentLevel + "");
    },
    loadTextures: function() {
        this.loadPlayerTextures("robot");
        this.loadBiomeTextures("grass");
        this.loadEnemyTextures();
        this.loadOtherTextures();
    },
    loadBiomeTextures: function (biome) {
        var textures = this.textureManager;
        textures.background = [];
        textures.ground = [];

        textures.getSprite(textures.background, "textures/bg/" + biome + ".png");
        textures.getSpriteSheet(textures.ground, "textures/tiles/" + biome + ".png", 0, 3, 0, 6, 128, 128);
    },
    loadPlayerTextures: function (player) {
        var textures = this.textureManager;
        textures.player = [];

        textures.getSpriteSheet(textures.player, "textures/players/" + player + ".png", 0, 6, 0, 5, 128, 128);
    },
    loadEnemyTextures: function () {
        var textures = this.textureManager;
        textures.enemy = {
            slime: [],
            ghost: [],
            fish: []
        };

        textures.getSpriteSheet(textures.enemy.slime, "textures/enemies.png", 0, 1, 0, 4, 128, 128);
        textures.getSpriteSheet(textures.enemy.ghost, "textures/enemies.png", 1, 2, 0, 3, 128, 128);
        textures.getSpriteSheet(textures.enemy.fish, "textures/enemies.png", 2, 3, 0, 3, 128, 128);
    },
    loadOtherTextures: function () {
        var textures = this.textureManager;
        textures.hud = [];
        textures.items = [];
        textures.colors = [];

        textures.getSpriteSheet(textures.hud, "textures/hud.png", 0, 3, 0, 5, 128, 128);
        textures.getSpriteSheet(textures.items, "textures/items.png", 0, 5, 0, 4, 128, 128);
        textures.getColor([0, 0, 0, 200]);
        textures.getColor([0, 0, 50, 200]);
        textures.getColor([0, 100, 0, 200]);
    },
    loadScene: function (path) {
        game.waitToLoad++;
        var self = this;
        var http_request = new XMLHttpRequest();
        http_request.onreadystatechange = function () {
            if (http_request.readyState == 4) {
                self.scene = new Scene(JSON.parse(http_request.responseText));
                game.waitToLoad--;
            }
        };

        http_request.open("GET", "scenes/" + path + ".json", true);
        http_request.send();
    },
    uploadScene: function () {
        var reader = new FileReader();
        reader.onload = function () {
            var data = JSON.parse(reader.result);
            if (data.checksum == 36479732) {
                game.scene = new Scene(data);
                game.hud.menu("mainMenu");
            }
        };

        var input = document.createElement("input");
        input.type = "file";
        input.click();
        input.onchange = function (event) {
            reader.readAsText(input.files[0]);
        };
    },
    saveScene: function () {
        var data = {
            checksum: 36479732,
            ground: [],
            decor: [],
            pickups: [],
            environment: [],
            enemies: []
        };

        var fillData = function (data, scenePool) {
            for (var i = 0; i < scenePool.length; ++i) {
                data.push(scenePool[i].writeData());
            }
        };

        fillData(data.ground, this.scene.ground);
        fillData(data.decor, this.scene.decor);
        fillData(data.pickups, this.scene.pickups);
        fillData(data.environment, this.scene.environment);
        fillData(data.enemies, this.scene.enemies);

        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], {type: "text/json"}));
        a.download = "scene.json";
        a.click();
    },
    pause: function () {
        this.waitToLoad = 1 - game.waitToLoad;
        this.scene.lastTime = new Date().getTime();
    }
};

function gameLoop() {
    requestAnimFrame(gameLoop);

    if (game.waitToLoad == 0) {
        game.tick();        // Update game world

        if (game.editor.isOn)
            game.editor.loop();
        else
            game.loop();
    }
}