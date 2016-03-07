function handleLoadedTexture(texture) {
    GL.bindTexture(GL.TEXTURE_2D, texture);

    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, texture.image);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);

    GL.bindTexture(GL.TEXTURE_2D, null);
}

function initTexture(path) {
    var newTexture = GL.createTexture();

    GL.bindTexture(GL.TEXTURE_2D, newTexture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

    newTexture.image = new Image();
    newTexture.image.onload = function () {
        handleLoadedTexture(newTexture)
    };
    newTexture.image.src = path;

    return newTexture;
}

function setTexture(texture) {
    if (textureManager.currentTexture != texture) {
        textureManager.currentTexture = texture;
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.uniform1i(shaderProgram.samplerUniform, 0);
    }
}