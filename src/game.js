var Game = function () {
    webGLStart();
    this.textureManager = new TextureManager();
    this.hud = new HUD();
    this.inputManager = new Input();
    this.editor = new Editor();

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
        this.loadTextures();
        this.player = new Player();
        this.loadScene("0");
        gameLoop();
    },
    tick: function () {
        var timeNow = new Date().getTime();
        if (this.lastTime != 0) {
            this.elapsed = timeNow - this.lastTime;
            // Time step correction
            if (this.elapsed > 60) this.elapsed = 60;
        }
        this.lastTime = timeNow;
    },
    finishedLoadingResource: function () {
        this.waitToLoad--;
    },
    nextLevel: function () {
        this.currentLevel = (this.currentLevel + 1) % this.numberOfLevels;
        this.loadScene(this.currentLevel + "");
    },
    loadTextures: function () {
        var textures = this.textureManager,
            biomes = ['grass', 'snow', 'desert'],
            biome = biomes[Math.floor(Math.random() * biomes.length)];

        textures.getSprite(textures.background, "textures/bg/" + biome + ".png");
        textures.getSpriteSheet(textures.player.idle, "textures/robot.png", 0, 2, 0, 5, 128, 128);
        textures.getSpriteSheet(textures.player.run, "textures/robot.png", 2, 4, 0, 4, 128, 128);
        textures.getSpriteSheet(textures.player.jump, "textures/robot.png", 4, 6, 0, 5, 128, 128);
        textures.getSpriteSheet(textures.hud, "textures/hud.png", 0, 3, 0, 5, 128, 128);
        textures.getSpriteSheet(textures.items, "textures/items.png", 0, 5, 0, 4, 128, 128);
        textures.getSpriteSheet(textures.ground, "textures/tiles/" + biome + ".png", 0, 3, 0, 6, 128, 128);
        textures.getColor([0, 0, 0, 200]);
        textures.getColor([0, 0, 50, 200]);
    },
    loadScene: function (path) {
        this.waitToLoad++;
        var self = this;
        var http_request = new XMLHttpRequest();
        http_request.onreadystatechange = function () {
            if (http_request.readyState == 4) {
                self.scene = new Scene(JSON.parse(http_request.responseText));
                self.finishedLoadingResource();
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
                game.hud.mainMenu();
            }
        };
        reader.readAsText(document.getElementById("fileSelecter").files[0]);
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
                var tmp = {
                    pos: {
                        x: scenePool[i].position.x,
                        y: scenePool[i].position.y
                    }
                };
                tmp.texture = scenePool[i].textureIndex;
                if (scenePool[i].scale.x != 1.0 || scenePool[i].scale.y != 1.0) {
                    tmp.scale = {
                        x: scenePool[i].scale.x,
                        y: scenePool[i].scale.y
                    };
                }
                if (scenePool[i].tag != "StaticObject") {
                    tmp.tag = scenePool[i].tag;
                }
                data.push(tmp);
            }
        };

        fillData(data.ground, this.scene.ground);
        fillData(data.decor, this.scene.decor);
        fillData(data.pickups, this.scene.pickups);
        fillData(data.environment, this.scene.environment);
        fillData(data.enemies, this.scene.enemies);
        if (this.player.respawnPosition.x != 0 || this.player.respawnPosition.y != 0)
            data.respawn = this.player.respawnPosition;

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

var game;

function startGame() {
    game = new Game();
    game.start();
}

function gameLoop() {
    requestAnimFrame(gameLoop);

    if (game.waitToLoad == 0) {
        game.tick();                          // Update game world

        game.scene.render();                    // Render game world

        if (game.editor.isOn) {
            game.editor.handleInput();          // Handle editor input

            if (game.editor.selectOn)
                game.editor.drawObjectSelection();
            game.editor.drawUsedObject();
        }
        else {
            game.inputManager.handleInput();    // Handle player input

            game.player.update();               // Update player
            game.scene.update();                // Update scene

            game.player.render();               // Render player
            game.hud.render();                  // Render in-game HUD
        }
    }
}