var Player = function (texturePool, textureIndex, mass) {
    MovableObject.call(this, texturePool, textureIndex, mass);
    this.animator = new Animator(this, game.textureManager.player);
    this.respawnPosition = new Vector(0, 0);
    this.currentLives = this.maxLives = 3;
};

Player.prototype = Object.create(MovableObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.move = function (direction) {
    if (direction == "stop") {
        this.rigidBody.speed.x = 0;
        return;
    }
    var moveSpeed = 0.004;
    if (direction == "left") {
        this.rigidBody.speed.x = -moveSpeed;
        this.scale.x = -1;
    } else if (direction == "right") {
        this.rigidBody.speed.x = moveSpeed;
        this.scale.x = 1;
    }
};

Player.prototype.jump = function () {
    var jumpForce = 0.015;
    if (this.rigidBody.isGrounded) {
        this.rigidBody.isGrounded = false;
        this.rigidBody.force.y = jumpForce;
    }
};

Player.prototype.checkForDeath = function() {
    if (this.position.y < -4 || this.position.y > 5) {
        this.currentLives -= 0.5;
        if (this.currentLives <= 0) {
            // Game over
            this.currentLives = 1;
        }
        this.respawn();
    }
};

Player.prototype.respawn = function() {
    this.position.set(this.respawnPosition.x, this.respawnPosition.y);
    this.rigidBody.isGrounded = false;
    this.rigidBody.resetSpeedAndForce();
};