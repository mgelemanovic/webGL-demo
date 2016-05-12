var HUD = function () {
    this.visibility = ["hidden", "visible"];
    this.mainMenuStatus = 0;
};

HUD.prototype = {
    render: function () {
        var hudElement = new GameObject(game.textureManager.hud, 13),
            camera = game.scene.camera,
            maxLives = game.scene.player.maxLives,
            currentLives = game.scene.player.currentLives,
            score = game.score,
            position = 10.5,
            i;

        var drawElement = function (offset) {
            hudElement.position.x = camera.x + offset;
            hudElement.draw();
        };

        hudElement.position.y = camera.y + 4.5;
        hudElement.drawDistance = -10;

        // Health rendering
        for (i = 0; i < Math.floor(currentLives); ++i) {
            drawElement(i - position);
        }
        if (currentLives - i == 0.5) {
            hudElement.textureIndex = 12;
            drawElement(i - position);
            ++i;
        }
        hudElement.textureIndex = 11;
        for (; i < maxLives; ++i) {
            drawElement(i - position);
        }

        // Score rendering
        hudElement.textureIndex = 14;
        drawElement(position - 2);
        hudElement.textureIndex = 10;
        drawElement(position - 1.25);
        hudElement.textureIndex = Math.floor(score / 10) % 10;
        drawElement(position - 0.5);
        hudElement.textureIndex = score % 10;
        drawElement(position);
    },
    mainMenu: function () {
        this.mainMenuStatus = 1 - this.mainMenuStatus;
        document.getElementById("menu").style.visibility = this.visibility[this.mainMenuStatus];
        game.pause();
    }
};