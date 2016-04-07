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
    var heart = new GameObject(game.textureManager.hud, 13);
    var maxLives = game.scene.player.maxLives, currentLives = game.scene.player.currentLives;
    heart.drawDistance = -10;
    var i;
    for (i = 0; i < Math.floor(currentLives); ++i) {
        heart.position.set(game.scene.camera.x - 6.5 + i, game.scene.camera.y + 4.5);
        heart.draw();
    }
    if (currentLives - i == 0.5) {
        heart.textureIndex = 12;
        heart.position.set(game.scene.camera.x - 6.5 + i, game.scene.camera.y + 4.5);
        heart.draw();
        ++i;
    }
    heart.textureIndex = 11;
    for (; i < maxLives; ++i) {
        heart.position.set(game.scene.camera.x - 6.5 + i, game.scene.camera.y + 4.5);
        heart.draw();
    }
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