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

// Create a WebGL context
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

// Compile a shader and return it
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

// Grab vertex and fragment shader and link them into a shader program
function initShaders() {
    var fragmentShader = getShader(GL, "shader-fs");
    var vertexShader = getShader(GL, "shader-vs");

    var shaderProgram = GL.createProgram();
    GL.attachShader(shaderProgram, vertexShader);
    GL.attachShader(shaderProgram, fragmentShader);
    GL.linkProgram(shaderProgram);

    if (!GL.getProgramParameter(shaderProgram, GL.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    GL.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = GL.getAttribLocation(shaderProgram, "aVertexPosition");
    GL.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = GL.getAttribLocation(shaderProgram, "aTextureCoord");
    GL.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = GL.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = GL.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = GL.getUniformLocation(shaderProgram, "uSampler");

    return shaderProgram;
}

// Buffer initialization
function createBufferFromData(data, itemSize, numItems) {
    var newBuffer = GL.createBuffer();

    GL.bindBuffer(GL.ARRAY_BUFFER, newBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data), GL.STATIC_DRAW);

    newBuffer.itemSize = itemSize;
    newBuffer.numItems = numItems;

    return newBuffer;
}

var squareVertexDistance = 0.5;

function initBuffers() {
    var vertices = [
        -squareVertexDistance, squareVertexDistance, 0.0,
        squareVertexDistance, squareVertexDistance, 0.0,
        -squareVertexDistance, -squareVertexDistance, 0.0,
        squareVertexDistance, -squareVertexDistance, 0.0
    ];
    var textureCoords = [
        0.0, 1.0,
        1.0, 1.0,
        0.0, 0.0,
        1.0, 0.0
    ];
    return {
        position: createBufferFromData(vertices, 3, 4),
        textureCoord: createBufferFromData(textureCoords, 2, 4)
    }
}