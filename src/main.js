var GL;
var shaderProgram;
var vertexBuffer = {
    position: null,
    textureCoord: null
};

var inputManager;
var textureManager = {  // Holds all textures
    currentTexture: null,
    player: null,
    ground: null,
    background: null
};

var scene;
var player;
var ground; // Not okay
var background; // Kinda okay, do I really need it, tho???

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
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.viewport(0, 0, GL.viewportWidth, GL.viewportHeight);

    GL.enable(GL.BLEND);
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer.position);
    GL.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.position.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer.textureCoord);
    GL.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexBuffer.textureCoord.itemSize, GL.FLOAT, false, 0, 0);

    //Texture loading
    textureManager.background = initTexture(null);
    textureManager.player = initTexture("textures/charmander.png");
    textureManager.ground = initTexture("textures/ground.png");

    //GameObject creations
    scene = new SceneManager(); //Pass in JSON to load scene
    player = new MovableObject(textureManager.player, -5, 50);  //Mass is wtf
    ground = new GameObject(textureManager.ground, -5);
    ground.position.y = -2;
    background = new GameObject(textureManager.background, -0.1);   //Maybe clearColor set to sky is better, than this shit

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