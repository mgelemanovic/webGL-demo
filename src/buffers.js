function createBufferFromData(data, itemSize, numItems) {
    var newBuffer = GL.createBuffer();

    GL.bindBuffer(GL.ARRAY_BUFFER, newBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data), GL.STATIC_DRAW);

    newBuffer.itemSize = itemSize;
    newBuffer.numItems = numItems;

    return newBuffer;
}

function initBuffers() {
    var vertices = [
        -0.5, 0.5, 0.0,
        0.5, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0
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