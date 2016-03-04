function createBufferFromData(data, itemSize, numItems) {
    var newBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    newBuffer.itemSize = itemSize;
    newBuffer.numItems = numItems;

    return newBuffer;
}

function initBuffers() {
    var vertices = [
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
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