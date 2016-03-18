var Game = function () {
    webGLStart();
    this.scene = null;
    this.inputManager = new Input();
    this.textureManager = new TextureManager();
    this.editorMode = false;
    this.isRunning = false;
};

Game.prototype.loadScene = function (path) {
    var self = this;
    var http_request = new XMLHttpRequest();
    http_request.onreadystatechange = function () {
        if (http_request.readyState == 4) {
            // Javascript function JSON.parse to parse JSON data
            self.scene = new SceneManager(JSON.parse(http_request.responseText));
            self.isRunning = true;
        }
    };

    http_request.open("GET", path, true);
    http_request.send();
};

Game.prototype.saveScene = function (path) {
    var data = {
        ground: []
    };
    var ground = this.scene.ground;
    for (var i = 0; i < ground.length; ++i) {
        var tmp = {
            pos: {
                x: ground[i].position.x,
                y: ground[i].position.y
            }
        };
        if (ground[i].textureIndex != 0) {
            tmp.texture = ground[i].textureIndex;
        }
        if (ground[i].scale.x != 1.0 || ground[i].scale.y != 1.0) {
            tmp.scale = {
                x: ground[i].scale.x,
                y: ground[i].scale.y
            };
        }
        data.ground.push(tmp);
    }
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(data)], {type: "text/json"});
    a.href = URL.createObjectURL(file);
    a.download = path;
    a.click();
};

var game;

function startGame() {
    game = new Game();

    //Texture loading
    game.textureManager.initTexture(game.textureManager.player, "textures/charmander.png");
    game.textureManager.initTexture(game.textureManager.ground, "textures/5.png");
    game.textureManager.initTexture(game.textureManager.ground, "textures/2.png");

    //Scene loading
    game.loadScene("scenes/demo.json");
    gameLoop();
}

function gameLoop() {
    requestAnimFrame(gameLoop);

    if (game.isRunning) {
        game.inputManager.handleInput();
        game.scene.update();
        game.scene.render();
    }
}