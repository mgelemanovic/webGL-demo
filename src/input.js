var currentlyPressedKeys = {}; //Try squeezing it into Input class as member

var Input = function () {
    document.onkeydown = this.handleKeyDown;
    document.onkeyup = this.handleKeyUp;
    canvas.onmousedown = this.handleMouseDown;
};

Input.prototype.handleKeyDown = function (event) {
    currentlyPressedKeys[event.keyCode] = true;
};

Input.prototype.handleKeyUp = function (event) {
    currentlyPressedKeys[event.keyCode] = false;
};

Input.prototype.handleMouseDown = function (event) {
    var mouseClickPos = {
        x: Math.round(game.scene.cameraX + (event.pageX - canvas.offsetLeft - canvas.width / 2) / 100),
        y: Math.round(game.scene.cameraY + (event.pageY - canvas.offsetTop - canvas.height / 2) / -100)
    };

    if (game.editorMode) {
        switch (event.which) {
            case 1:
                game.scene.addObjectToScene(game.scene.ground, new GameObject(textureManager.ground, 1), mouseClickPos, {
                    x: 1,
                    y: 1
                });
                break;
            case 2:
                game.scene.removeObjectFromScene(game.scene.ground, game.scene.checkForCoords(scene.ground, mouseClickPos));
                break;
        }
    }
};

Input.prototype.handleInput = function () {
    // Pressed right
    if (currentlyPressedKeys[39]) {
        game.scene.player.move("right");
    }
    // Pressed left
    if (currentlyPressedKeys[37]) {
        game.scene.player.move("left");
    }
    // Pressed up
    if (currentlyPressedKeys[38]) {
        game.scene.player.jump();
    }
    // Pressed r
    if (currentlyPressedKeys[82]) {
        game.scene.player.respawn();
        currentlyPressedKeys[82] = false;
    }
    // Pressed s
    if (currentlyPressedKeys[83]) {
        game.saveScene("newScene.json");
        currentlyPressedKeys[83] = false;
    }
    // Pressed e
    if (currentlyPressedKeys[69]) {
        game.editorMode = !game.editorMode;
        currentlyPressedKeys[69] = false;
    }
};