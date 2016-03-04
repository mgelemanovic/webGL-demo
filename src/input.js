var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleInput() {
    if (currentlyPressedKeys[38]) {
        distance += 1;
    }
    if (currentlyPressedKeys[40]) {
        distance -= 1;
    }
}