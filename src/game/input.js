var currentlyPressedKeys = {}; //Try squeezing it into Input class as member

var Input = function () {
    this.commands = {
        moveRight: 39,  // Right arrow
        moveLeft: 37,   // Left arrow
        jump: 32,       // Spacebar
        respawn: 82,    // R
        save: 83,       // S
        editor: 69      // E
    };
    document.onkeydown = this.handleKeyDown;
    document.onkeyup = this.handleKeyUp;
};

Input.prototype.handleKeyDown = function (event) {
    // Pause the game if P is pressed
    if (event.keyCode == 80)
        game.pause();

    currentlyPressedKeys[event.keyCode] = true;
};

Input.prototype.handleKeyUp = function (event) {
    currentlyPressedKeys[event.keyCode] = false;
};

Input.prototype.clearInput = function () {
    for (var prop in this.commands) {
        currentlyPressedKeys[this.commands[prop]] = false;
    }
};

Input.prototype.handleInput = function () {
    // Movement handling
    if (currentlyPressedKeys[this.commands.moveRight] || currentlyPressedKeys[this.commands.moveLeft]) {
        // Pressed right
        if (currentlyPressedKeys[this.commands.moveRight])
            game.scene.player.move("RIGHT");
        // Pressed left
        else if (currentlyPressedKeys[this.commands.moveLeft])
            game.scene.player.move("LEFT");
    } else
        game.scene.player.move("STOP");

    // Jump handling
    if (currentlyPressedKeys[this.commands.jump]) {
        game.scene.player.jump();
    }
    // Respawn player
    if (currentlyPressedKeys[this.commands.respawn]) {
        game.scene.player.respawn();
        game.scene.player.hurt(0.5);    // Temporary
        currentlyPressedKeys[this.commands.respawn] = false;
    }
    // Save scene
    if (currentlyPressedKeys[this.commands.save]) {
        game.saveScene("scene.json");
        currentlyPressedKeys[this.commands.save] = false;
    }
    // Turn editor mode on
    if (currentlyPressedKeys[this.commands.editor]) {
        if (confirm("Create new scene?"))
            game.changeScene("empty");
        game.editor.changeOnOff();
        currentlyPressedKeys[this.commands.editor] = false;
    }
};