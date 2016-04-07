var TextureManager = function () {
    this.currentTexture = null;
    this.background = [];
    this.player = {
        idle: [],
        run: [],
        jump: []
    };
    this.ground = [];
};

TextureManager.prototype.setTexture = function (texture) {
    if (this.currentTexture != texture) { // Set as current texture, only if it's not already being used
        this.currentTexture = texture;
        // I'm only using one texture buffer, so activating and updating shader is not needed
        //GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture);
        //GL.uniform1i(shaderProgram.samplerUniform, 0);
    }
};

TextureManager.prototype.initTexture = function (pool, path) {
    var newTexture = GL.createTexture();

    // Set temporary texture to background color, also used if no image is given for texture
    GL.bindTexture(GL.TEXTURE_2D, newTexture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE,
        new Uint8Array([backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a]));
    GL.bindTexture(GL.TEXTURE_2D, null);

    if (path != null) {
        newTexture.image = new Image();
        newTexture.image.onload = function () {
            GL.bindTexture(GL.TEXTURE_2D, newTexture);

            GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, newTexture.image);

            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);

            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

            GL.bindTexture(GL.TEXTURE_2D, null);

            game.finishedLoadingResource();
        };
        newTexture.image.src = path;
    }

    pool.push(newTexture);
};

TextureManager.prototype.initSpriteSheet = function (pool, path, iMIN, iMAX, jMIN, jMAX, w, h) {
    var image = new Image();

    image.onload = function () {
        for (var i = iMIN; i < iMAX; ++i) {
            for (var j = jMIN; j < jMAX; ++j) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.height = h;
                canvas.width = w;

                ctx.drawImage(image, w * j, h * i, w, h, 0, 0, w, h);

                var newTexture = GL.createTexture();
                GL.bindTexture(GL.TEXTURE_2D, newTexture);

                GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, canvas);

                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);

                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

                pool.push(newTexture);
            }
        }

        game.finishedLoadingResource();
    };

    image.src = path;
};