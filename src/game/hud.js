var HUD = function () {
    // Ingame HUD info

    // Debug info
    this.resourceLoading = document.createTextNode("0");
    document.getElementById("resourceLoading").appendChild(this.resourceLoading);

    this.editor = document.createTextNode("OFF");
    document.getElementById("editorMode").appendChild(this.editor);

    this.textureID = document.createTextNode("");
    document.getElementById("textureID").appendChild(this.textureID);

    this.objects = document.createTextNode("0");
    document.getElementById("loadedObjects").appendChild(this.objects);
};

HUD.prototype.render = function() {
    var hudElement = new GameObject(game.textureManager.hud, 13),
        camera = game.scene.camera,
        maxLives = game.scene.player.maxLives,
        currentLives = game.scene.player.currentLives,
        score = game.score,
        i;

    var drawElement = function(offset) {
        hudElement.position.x = camera.x + offset;
        hudElement.draw();
    };

    hudElement.position.y = camera.y + 4.5;
    hudElement.drawDistance = -10;

    // Health rendering
    for (i = 0; i < Math.floor(currentLives); ++i) {
        drawElement(-6.5 + i);
    }
    if (currentLives - i == 0.5) {
        hudElement.textureIndex = 12;
        drawElement(-6.5 + i);
        ++i;
    }
    hudElement.textureIndex = 11;
    for (; i < maxLives; ++i) {
        drawElement(-6.5 + i);
    }

    // Score rendering
    hudElement.textureIndex = 14;
    drawElement(4.5);
    hudElement.textureIndex = 10;
    drawElement(5.25);
    hudElement.textureIndex = Math.floor(score / 10) % 10;
    drawElement(6);
    hudElement.textureIndex = score % 10;
    drawElement(6.5);
};

// Debug info
HUD.prototype.clearHUD = function() {
    this.resourceLoading.nodeValue = "";
    this.editor.nodeValue = "";
    this.textureID.nodeValue = "";
    this.objects.nodeValue = "";
};

HUD.prototype.updateEditor = function (objectPool, index) {
    if (game.editor.isOn) {
        this.editor.nodeValue = "ON";
        this.textureID.nodeValue = objectPool + ": " + index;
    }
    else {
        this.editor.nodeValue = "OFF";
        this.textureID.nodeValue = "";
    }
};

HUD.prototype.updateLoadedObjects = function (n) {
    this.objects.nodeValue = n;
};

HUD.prototype.updateResourceLoading = function() {
    var total = 6;
    this.resourceLoading.nodeValue = (100.0 * ((total - game.waitToLoad) / total)).toFixed(0);
};