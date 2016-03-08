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
        player.position.x += 0.05;  // Extract into a variable?
        //Needs to be 1 when having a texture normally facing right
        player.scale.x = -1;
    }
    if (currentlyPressedKeys[37]) {
        player.position.x -= 0.05;
        //Needs to be -1 when having a texture normally facing right
        player.scale.x = 1;
    }

    //KILL THIS MONSTROSITY
    if (currentlyPressedKeys[38] && player.rigidBody.isGrounded) {
        wannaJump = true;
        player.rigidBody.forceY = 0.015;
        player.rigidBody.isGrounded = false;
    }
    //BAD GELE BAD
    else if (!currentlyPressedKeys[38]) {
        wannaJump = false;
    }
    //This is tolerable
    else {
        player.rigidBody.forceY = 0;
    }
};

//Go fuck yourself, idiot^3
var wannaJump;