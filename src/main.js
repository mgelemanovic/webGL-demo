var gl;
var shaderProgram;

var vertexBuffer = {
    position: null,
    textureCoord: null
};

var textures = [];

function webGLStart() {
    var canvas = document.getElementById("webgl-context");
    gl = initGL(canvas);
    shaderProgram = initShaders();
    vertexBuffer = initBuffers();
    textures.push(initTexture("textures/bg.jpg"));
    textures.push(initTexture("textures/charmander.png"));

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gameLoop();
}

function gameLoop() {
    requestAnimFrame(gameLoop);

    handleInput();
    update();
    render();
}

function initGL(canvas) {
    var context;

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