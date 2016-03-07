var currentlyPressedKeys = {};

var Input = function() {};

Input.prototype.handleKeyDown = function(event) {
    currentlyPressedKeys[event.keyCode] = true;
};

Input.prototype.handleKeyUp = function(event) {
    currentlyPressedKeys[event.keyCode] = false;
};

Input.prototype.handleInput = function() {
    if (currentlyPressedKeys[39]) {
        player.position.x += 0.05;
    }
    if (currentlyPressedKeys[37]) {
        player.position.x -= 0.05;
    }
    if (currentlyPressedKeys[38]) {
        player.position.y = 2;
    }
};