var gl;
var shaderProgram;

var neheTexture;

var vertexBuffer = {
    position: null,
    textureCoord: null
};

function gameLoop() {
    requestAnimFrame(gameLoop);

    render();
    update();
}

function webGLStart() {
    var canvas = document.getElementById("webgl-context");
    gl = initGL(canvas);
    shaderProgram = initShaders();
    vertexBuffer = initBuffers();
    neheTexture = initTexture("nehe.gif");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gameLoop();
}