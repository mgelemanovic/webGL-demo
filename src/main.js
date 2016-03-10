var GL;
var shaderProgram;
var vertexBuffer = {    // Info for drawing squares and applying texture to them
    position: null,
    textureCoord: null
};
var inputManager;   // Handles input from player
var textureManager = {  // Holds all textures
    currentTexture: null,
    player: null,
    ground: null
};
var backgroundColor = {
    r: 135,
    g: 206,
    b: 250,
    a: 255
};
var scene;  // Currently displayed scene

function webGLStart() {
    var canvas = document.getElementById("webgl-context");
    GL = initGL(canvas);
    shaderProgram = initShaders();
    vertexBuffer = initBuffers();

    //Input binding
    inputManager = new Input();
    document.onkeydown = inputManager.handleKeyDown;
    document.onkeyup = inputManager.handleKeyUp;

    //WebGL state setup
    GL.clearColor(backgroundColor.r / 255, backgroundColor.g / 255, backgroundColor.b / 255, backgroundColor.a / 255);
    GL.viewport(0, 0, GL.viewportWidth, GL.viewportHeight);
    GL.enable(GL.BLEND);
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer.position);
    GL.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.position.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer.textureCoord);
    GL.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexBuffer.textureCoord.itemSize, GL.FLOAT, false, 0, 0);

    //Texture loading
    textureManager.player = initTextureFromImage("textures/charmander.png");
    //textureManager.ground = initTextureWithColor([1, 166, 17, 255]);
    textureManager.ground = initTextureWithColor(
        [Math.floor((Math.random() * 255)), Math.floor((Math.random() * 255)), Math.floor((Math.random() * 255)), 255]);

    //Scene loading
    scene = new SceneManager(); //Pass in JSON to load scene

    gameLoop();
}

function gameLoop() {
    requestAnimFrame(gameLoop);

    inputManager.handleInput();
    scene.update();
    scene.render();
}

function initGL(canvas) {
    var context;
    // Add support for webgl and webkit
    try {
        context = canvas.getContext("experimental-webgl");
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
    } catch (e) {
    }

    if (!context) {
        alert("Could not initialise WebGL, sorry :-(");
        return null;
    }

    return context;
}