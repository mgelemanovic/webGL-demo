var game;

var Game = function () {
    webGLStart();
    this.textureManager = new TextureManager();
    this.hud = new HUD();

    this.waitToLoad = 0;
    this.drawDistance = -7;
    this.score = 0;

    this.currentLevel = 0;
    this.numberOfLevels = 3;

    this.lastTime = 0;
    this.elapsed = 0;
};

Game.prototype = {
    start: function () {
        document.getElementById("startMenu").style.visibility = "hidden";

        this.scene = new Scene();
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
            this.hud.updateFPS(this.elapsed);
            // Time step correction
            if (this.elapsed > 30) this.elapsed = 30;
        }
        this.lastTime = timeNow;
    },
    loop: function () {
        this.inputManager.handleInput();    // Handle player input

        this.player.update();               // Update player
        this.scene.update();                // Update scene
        this.scene.camera.followPlayer();

        this.scene.render();                // Render game world
        this.player.render();               // Render player
        this.hud.render();                  // Render in-game HUD
    },
    nextLevel: function () {
        this.currentLevel = (this.currentLevel + 1) % this.numberOfLevels;
        this.loadScene(this.currentLevel + "");
    },
    loadTextures: function () {
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
        textures.getSpriteSheet(textures.ground, "textures/tiles/" + biome + ".png", 0, 6, 0, 4, 128, 128);
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
            fish: [],
            saw: []
        };

        textures.getSpriteSheet(textures.enemy.slime, "textures/enemies.png", 0, 1, 2, 5, 128, 128);
        textures.getSpriteSheet(textures.enemy.ghost, "textures/enemies.png", 1, 2, 0, 2, 128, 128);
        textures.getSpriteSheet(textures.enemy.fish, "textures/enemies.png", 1, 2, 2, 5, 128, 128);
        textures.getSpriteSheet(textures.enemy.saw, "textures/enemies.png", 0, 1, 0, 2, 128, 128);
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
        textures.getColor([0, 100, 0, 175]);
        textures.getColor([50, 0, 0, 200]);
    },
    loadScene: function (path) {
        game.waitToLoad++;
        var http_request = new XMLHttpRequest();
        http_request.onreadystatechange = function () {
            if (http_request.readyState == 4) {
                var data = JSON.parse(http_request.responseText);
                if (data.checksum == 36479732) {
                    game.scene.init(data.sceneInfo);
                    game.waitToLoad--;
                }
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
                game.scene.init(data.sceneInfo);
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
            sceneInfo: []
        };

        var fillData = function (scenePool) {
            for (var i = 0; i < scenePool.length; ++i)
                data.sceneInfo.push(scenePool[i].writeData());
        };

        fillData(this.scene.ground);
        fillData(this.scene.decor);
        fillData(this.scene.pickups);
        fillData(this.scene.environment);
        fillData(this.scene.enemies);
        fillData(this.scene.removed);

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