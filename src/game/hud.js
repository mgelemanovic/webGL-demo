var HUD = function () {
    this.resourceLoading = document.createTextNode("0");
    document.getElementById("resourceLoading").appendChild(this.resourceLoading);
};

HUD.prototype = {
    render: function () {
        var hudElement = new GameObject(game.textureManager.hud, 13),
            camera = game.scene.camera,
            maxLives = game.scene.player.maxLives,
            currentLives = game.scene.player.currentLives,
            score = game.score,
            i;

        var drawElement = function (offset) {
            hudElement.position.x = camera.x + offset;
            hudElement.draw();
        };

        hudElement.position.y = camera.y + 4.5;
        hudElement.drawDistance = -10;

        // Health rendering
        for (i = 0; i < Math.floor(currentLives); ++i) {
            drawElement(-10.5 + i);
        }
        if (currentLives - i == 0.5) {
            hudElement.textureIndex = 12;
            drawElement(-10.5 + i);
            ++i;
        }
        hudElement.textureIndex = 11;
        for (; i < maxLives; ++i) {
            drawElement(-10.5 + i);
        }

        // Score rendering
        hudElement.textureIndex = 14;
        drawElement(8.5);
        hudElement.textureIndex = 10;
        drawElement(9.25);
        hudElement.textureIndex = Math.floor(score / 10) % 10;
        drawElement(10);
        hudElement.textureIndex = score % 10;
        drawElement(10.5);
    },
    // Debug info
    clearHUD: function () {
        this.resourceLoading.nodeValue = "";
    },
    updateResourceLoading: function () {
        var total = 8;
        this.resourceLoading.nodeValue = (100.0 * ((total - game.waitToLoad) / total)).toFixed(0);
    }
};