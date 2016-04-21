var TextureManager = function () {
    this.currentTexture = null;
    this.background = [];
    this.player = {
        idle: [],
        run: [],
        jump: []
    };
    this.hud = [];
    this.ground = [];
    this.items = [];
    this.colors = [];
};

TextureManager.prototype = {
    setActiveTexture: function (texture) {
        // Set as current texture, only if it's not already being used
        if (this.currentTexture != texture) {
            this.currentTexture = texture;
            // I'm only using one texture buffer, so activating and updating shader is not needed
            //GL.activeTexture(GL.TEXTURE0);
            GL.bindTexture(GL.TEXTURE_2D, texture);
            //GL.uniform1i(shaderProgram.samplerUniform, 0);
        }
    },
    initTexture: function (src) {
        var newTexture = GL.createTexture();

        GL.bindTexture(GL.TEXTURE_2D, newTexture);

        GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, src);

        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);

        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

        return newTexture;
    },
    getSprite: function (pool, path) {
        var image = new Image(),
            self = this;

        image.onload = function () {
            pool.push(self.initTexture(image));
            game.finishedLoadingResource();
        };
        image.src = path;

    },
    getSpriteSheet: function (pool, path, iMIN, iMAX, jMIN, jMAX, w, h) {
        var image = new Image(),
            self = this,
            canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");

        image.onload = function () {
            for (var i = iMIN; i < iMAX; ++i) {
                for (var j = jMIN; j < jMAX; ++j) {
                    canvas.height = h;
                    canvas.width = w;
                    ctx.drawImage(image, w * j, h * i, w, h, 0, 0, w, h);

                    pool.push(self.initTexture(canvas));
                }
            }

            game.finishedLoadingResource();
        };

        image.src = path;
    },
    getColor: function (color) {
        var newTexture = GL.createTexture();

        GL.bindTexture(GL.TEXTURE_2D, newTexture);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array(color));
        GL.bindTexture(GL.TEXTURE_2D, null);

        this.colors.push(newTexture);
    }
};