function drawObject(posBuffer) {
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, posBuffer.numItems);
}

function render() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.position);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.position.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.textureCoord);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexBuffer.textureCoord.itemSize, gl.FLOAT, false, 0, 0);

    setTexture(neheTexture);
    mvPushMatrix();
    mat4.translate(mvMatrix, [-1.0, -3.0, -10.0]);
    drawObject(vertexBuffer.position);
    mvPopMatrix();
    mvPushMatrix();
    mat4.translate(mvMatrix, [1.0, -3.0, -10.0]);
    drawObject(vertexBuffer.position);
    mvPopMatrix();
}