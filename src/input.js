var currentlyPressedKeys = {}; //Try squeezing it into Input class as member

var Input = function () {
};

Input.prototype.handleKeyDown = function (event) {
    currentlyPressedKeys[event.keyCode] = true;
};

Input.prototype.handleKeyUp = function (event) {
    currentlyPressedKeys[event.keyCode] = false;
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
};