function handleLoadedTexture(texture) {
    GL.bindTexture(GL.TEXTURE_2D, texture);

    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, texture.image); //Error loading when opening locally

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);

    GL.bindTexture(GL.TEXTURE_2D, null);
}

function initTexture(path) {
    var newTexture = GL.createTexture();

    // Set temporary texture to nice sky color, also used if no image is given for texture
    // Used as background
    GL.bindTexture(GL.TEXTURE_2D, newTexture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([135, 206, 250, 255]));

    if (path != null) {
        newTexture.image = new Image();
        newTexture.image.onload = function () {
            handleLoadedTexture(newTexture)
        };
        newTexture.image.src = path;
    }

    return newTexture;
}

// If the texture is not set, set it
function setTexture(texture) {
    if (textureManager.currentTexture != texture) {
        textureManager.currentTexture = texture;
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.uniform1i(shaderProgram.samplerUniform, 0);
    }
}