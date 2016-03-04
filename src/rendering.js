function drawObject(position) {
    mvPushMatrix();
    mat4.translate(mvMatrix, position);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    mvPopMatrix();
}

var distance = -20.0;

function render() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.position);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.position.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.textureCoord);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexBuffer.textureCoord.itemSize, gl.FLOAT, false, 0, 0);

    var k = 0;
    for (var i = -10; i <= 10; i += 2) {
        for (var j = -10; j <= 10; j +=2) {
            setTexture(textures[k = 1 - k]);
            drawObject([i, j, distance]);
        }
    }
}