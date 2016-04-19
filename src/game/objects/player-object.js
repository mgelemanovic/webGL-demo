var Player = function (mass) {
    MovableObject.call(this, game.textureManager.player.idle, 0, mass);
    this.tag = "Player";
    this.animator = new Animator(this, game.textureManager.player);
    this.respawnPosition = new Vector(0, 0);
    this.currentLives = this.maxLives = 3;

    this.collider.w = 0.45;
    this.collider.h = 0.8;
};

Player.prototype = Object.assign(Object.create(MovableObject.prototype), {
    constructor: Player,
    move: function (direction) {
        if (direction == "STOP") {
            this.rigidBody.speed.x = 0;
            return;
        }
        var moveSpeed = 0.004;
        if (direction == "LEFT") {
            this.rigidBody.speed.x = -moveSpeed;
            this.scale.x = -1;
        } else if (direction == "RIGHT") {
            this.rigidBody.speed.x = moveSpeed;
            this.scale.x = 1;
        }
    },
    jump: function () {
        var jumpForce = 0.015;
        if (this.rigidBody.isGrounded) {
            this.rigidBody.isGrounded = false;
            this.rigidBody.force.y = jumpForce;
        }
    },
    hurt: function (dmg) {
        this.currentLives -= dmg;
    },
    checkForDeath: function () {
        // If the player falls from the map, or his health reaches 0
        // Respawn the player and put his health to 20% of his max HP
        if (this.position.y < -4 || this.position.y > 5 || this.currentLives <= 0) {
            this.respawn();
            this.currentLives = Math.ceil(this.maxLives * 0.2);
        }
    },
    respawn: function () {
        this.position.setv(this.respawnPosition);
        this.rigidBody.isGrounded = false;
        this.rigidBody.resetSpeedAndForce();
    },
    onCollision: function (other, direction) {
        if (other instanceof PickUpObject) {
            other.pickup();
            return;
        }
        MovableObject.prototype.onCollision.call(this, other, direction);
    }
});