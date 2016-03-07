function render() {
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    mat4.perspective(45, GL.viewportWidth / GL.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    for (var i = -5; i < 5; ++i) {
        background.position.x = i;
        background.draw();
    }

    player.draw();
}