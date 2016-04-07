var HUD = function () {
    this.resourceLoading = document.createTextNode("0");
    document.getElementById("resourceLoading").appendChild(this.resourceLoading);

    this.editor = document.createTextNode("OFF");
    document.getElementById("editorMode").appendChild(this.editor);

    this.textureID = document.createTextNode("");
    document.getElementById("textureID").appendChild(this.textureID);

    this.objects = document.createTextNode("0");
    document.getElementById("loadedObjects").appendChild(this.objects);
};

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