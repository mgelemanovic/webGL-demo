// Buffer initialization

var vertexBuffer = {    // Info for drawing squares and applying texture to them
    position: null,
    textureCoord: null
};

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