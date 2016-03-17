var GameInfo = function() {
    webGLStart();
    this.scene = null;
    this.inputManager = new Input();
    this.editorMode = false;
    this.isRunning = false;
};

GameInfo.prototype.loadScene = function(path) {
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

GameInfo.prototype.saveScene = function(path) {
    var data = {
        ground: []
    };
    var ground = this.scene.ground;
    for (var i = 0; i < ground.length; ++i) {
        var tmp = {
            texture: ground[i].textureIndex,
            pos: {
                x: ground[i].position.x,
                y: ground[i].position.y
            },
            scale: {
                x: ground[i].scale.x,
                y: ground[i].scale.y
            }
        };
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
    game = new GameInfo();

    //Texture loading
    textureManager.player.push(initTextureFromImage("textures/charmander.png"));
    //textureManager.ground = initTextureWithColor([1, 166, 17, 255]);
    textureManager.ground.push(initTextureWithColor(
        [Math.floor((Math.random() * 255)), Math.floor((Math.random() * 255)), Math.floor((Math.random() * 255)), 255]));
    textureManager.ground.push(initTextureWithColor(
        [Math.floor((Math.random() * 255)), Math.floor((Math.random() * 255)), Math.floor((Math.random() * 255)), 255]));

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