var canvas;

var GL;

var shaderProgram;

var vertexBuffer = {    // Info for drawing squares and applying texture to them
    position: null,
    textureCoord: null
};

function webGLStart() {
    canvas = document.getElementById("webgl-context");
    GL = initGL();
    shaderProgram = initShaders();
    vertexBuffer = initBuffers();

    //WebGL state setup
    GL.clearColor(backgroundColor.r / 255, backgroundColor.g / 255, backgroundColor.b / 255, backgroundColor.a / 255);
    GL.viewport(0, 0, GL.viewportWidth, GL.viewportHeight);
    GL.enable(GL.BLEND);
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer.position);
    GL.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.position.itemSize, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer.textureCoord);
    GL.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexBuffer.textureCoord.itemSize, GL.FLOAT, false, 0, 0);
}

function initGL() {
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