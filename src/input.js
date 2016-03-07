var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleInput() {
    if (currentlyPressedKeys[39]) {
        playerPosition += 0.1;
    }
    if (currentlyPressedKeys[37]) {
        playerPosition -= 0.1;
    }
}