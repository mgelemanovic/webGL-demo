var currentlyPressedKeys = {}; //Try squeezing it into Input class as member

var Input = function () {
    this.commands = {
        moveRight: 39,  // Right arrow
        moveLeft: 37,   // Left arrow
        jump: 32        // Spacebar
    };
    document.onkeydown = this.handleKeyDown;
    document.onkeyup = this.handleKeyUp;
};

Input.prototype = {
    handleKeyDown: function (event) {
        // Pause the game and show the menu if escape is pressed
        if (event.keyCode == 27)
            game.hud.menu("mainMenu");

        currentlyPressedKeys[event.keyCode] = true;
    },
    handleKeyUp: function (event) {
        currentlyPressedKeys[event.keyCode] = false;
    },
    clearInput: function () {
        for (var prop in this.commands) {
            currentlyPressedKeys[this.commands[prop]] = false;
        }
    },
    handleInput: function () {
        // Movement handling
        if (currentlyPressedKeys[this.commands.moveRight] || currentlyPressedKeys[this.commands.moveLeft]) {
            // Pressed right
            if (currentlyPressedKeys[this.commands.moveRight])
                game.player.move("RIGHT");
            // Pressed left
            else if (currentlyPressedKeys[this.commands.moveLeft])
                game.player.move("LEFT");
        } else
            game.player.move("STOP");

        // Jump handling
        if (currentlyPressedKeys[this.commands.jump]) {
            game.player.jump();
            currentlyPressedKeys[this.commands.jump] = false;
        }
    }
};