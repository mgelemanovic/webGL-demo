var scene;  // Currently displayed scene

var inputManager;   // Handles input from player

var backgroundColor = {
    r: 135,
    g: 206,
    b: 250,
    a: 255
};

var editor = true;

function startGame() {
    webGLStart();

    //Input binding
    inputManager = new Input();

    //Texture loading
    textureManager.player.push(initTextureFromImage("textures/charmander.png"));
    //textureManager.ground = initTextureWithColor([1, 166, 17, 255]);
    textureManager.ground.push(initTextureWithColor(
        [Math.floor((Math.random() * 255)), Math.floor((Math.random() * 255)), Math.floor((Math.random() * 255)), 255]));
    textureManager.ground.push(initTextureWithColor(
        [Math.floor((Math.random() * 255)), Math.floor((Math.random() * 255)), Math.floor((Math.random() * 255)), 255]));

    //Scene loading
    loadSceneInfo("scenes/demo.json");

    gameLoop();
}

function gameLoop() {
    requestAnimFrame(gameLoop);

    inputManager.handleInput();
    scene.update();
    scene.render();
}

function loadSceneInfo(path) {
    var http_request = new XMLHttpRequest();
    http_request.onreadystatechange = function () {
        if (http_request.readyState == 4) {
            // Javascript function JSON.parse to parse JSON data
            scene = new SceneManager(JSON.parse(http_request.responseText));
        }
    };

    http_request.open("GET", path, true);
    http_request.send();
}