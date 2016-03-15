var textureManager = {  // Holds all textures
    currentTexture: null,
    player: [],
    ground: []
};

function handleLoadedTexture(texture) {
    GL.bindTexture(GL.TEXTURE_2D, texture);

    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, texture.image); //Error loading when opening locally

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);

    GL.bindTexture(GL.TEXTURE_2D, null);
}

function initTextureFromImage(path) {
    var newTexture = GL.createTexture();

    // Set temporary texture to background color, also used if no image is given for texture
    GL.bindTexture(GL.TEXTURE_2D, newTexture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE,
        new Uint8Array([backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a]));
    GL.bindTexture(GL.TEXTURE_2D, null);

    if (path != null) {
        newTexture.image = new Image();
        newTexture.image.onload = function () {
            handleLoadedTexture(newTexture)
        };
        newTexture.image.src = path;
    }

    return newTexture;
}

function initTextureWithColor(color) {
    var newTexture = GL.createTexture();

    GL.bindTexture(GL.TEXTURE_2D, newTexture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array(color));
    GL.bindTexture(GL.TEXTURE_2D, null);

    return newTexture;
}

function setTexture(texture) {
    if (textureManager.currentTexture != texture) { // Set as current texture, only if it's not already being used
        textureManager.currentTexture = texture;
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.uniform1i(shaderProgram.samplerUniform, 0);
    }
}