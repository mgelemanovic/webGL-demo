var gl;
var shaderProgram;

var textures = [];

var vertexBuffer = {
    position: null,
    textureCoord: null
};

function gameLoop() {
    requestAnimFrame(gameLoop);

    handleInput();
    render();
    update();
}

function webGLStart() {
    var canvas = document.getElementById("webgl-context");
    gl = initGL(canvas);
    shaderProgram = initShaders();
    vertexBuffer = initBuffers();
    textures.push(initTexture("images/squirtle.gif"));
    textures.push(initTexture("images/charmander.png"));

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gameLoop();
}