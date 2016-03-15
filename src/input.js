var currentlyPressedKeys = {}; //Try squeezing it into Input class as member

var Input = function () {
    document.onkeydown = this.handleKeyDown;
    document.onkeyup = this.handleKeyUp;
    if (editor) {
        canvas.onmousedown = this.handleMouseDown;
    }
};

Input.prototype.handleKeyDown = function (event) {
    currentlyPressedKeys[event.keyCode] = true;
};

Input.prototype.handleKeyUp = function (event) {
    currentlyPressedKeys[event.keyCode] = false;
};

Input.prototype.handleMouseDown = function (event) {
    var mouseClickPos = {
        x: Math.round(scene.cameraX + (event.pageX - canvas.offsetLeft - canvas.width / 2) / 100),
        y: Math.round(scene.cameraY + (event.pageY - canvas.offsetTop - canvas.height / 2) / -100)
    };

    switch (event.which) {
        case 1:
            scene.addObjectToScene(scene.ground, new GameObject(textureManager.ground, 1), mouseClickPos, {
                x: 1,
                y: 1
            });
            break;
        case 2:
            scene.removeObjectFromScene(scene.ground, scene.checkForCoords(scene.ground, mouseClickPos));
            break;
    }
};

Input.prototype.handleInput = function () {
    if (currentlyPressedKeys[39]) {
        scene.player.move("right");
    }
    if (currentlyPressedKeys[37]) {
        scene.player.move("left");
    }
    if (currentlyPressedKeys[38]) {
        scene.player.jump();
    }
    if (currentlyPressedKeys[65]) {
        saveSceneInfo("newScene.json");
        currentlyPressedKeys[65] = false;
    }
};