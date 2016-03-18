var HUD = function () {
    this.fps = document.createTextNode("0");
    document.getElementById("fps").appendChild(this.fps);
    this.fps_index = 0;
    this.fps_sum = 0;
    this.fps_list = [];

    this.editor = document.createTextNode("OFF");
    document.getElementById("editorMode").appendChild(this.editor);

    this.objects = document.createTextNode("0");
    document.getElementById("loadedObjects").appendChild(this.objects);
};

HUD.prototype.updateEditor = function () {
    if (game.editorMode) this.editor.nodeValue = "ON";
    else this.editor.nodeValue = "OFF";
};

HUD.prototype.updateLoadedObjects = function (n) {
    this.objects.nodeValue = n;
};

HUD.prototype.updateFPS = function (newTick) {
    this.fps_sum -= this.fps_list[this.fps_index] | 0;
    this.fps_sum += newTick;
    this.fps_list[this.fps_index] = newTick;
    this.fps_index = (this.fps_index + 1) % 100;

    this.fps.nodeValue = (10000 / this.fps_sum).toFixed(2);
};