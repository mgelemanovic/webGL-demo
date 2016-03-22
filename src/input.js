var currentlyPressedKeys = {}; //Try squeezing it into Input class as member

var Input = function () {
    document.onkeydown = this.handleKeyDown;
    document.onkeyup = this.handleKeyUp;
};

Input.prototype.handleKeyDown = function (event) {
    currentlyPressedKeys[event.keyCode] = true;
};

Input.prototype.handleKeyUp = function (event) {
    currentlyPressedKeys[event.keyCode] = false;
};

Input.prototype.handleInput = function () {
    game.scene.player.animator.changeTexturePool(game.textureManager.player.idle);
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
        game.editor.changeOnOff();
        currentlyPressedKeys[69] = false;
    }
};