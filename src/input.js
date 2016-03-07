var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleInput() {
    if (currentlyPressedKeys[39]) {
        player.x += 0.05;
    }
    if (currentlyPressedKeys[37]) {
        player.x -= 0.05;
    }
}