var Player = function () {
    MovableObject.call(this, game.textureManager.player.idle, 0, 50);
    this.tag = "Player";
    this.animator = new Animator(5);
    this.respawnPosition = new Vector(0, 0);
    this.currentLives = this.maxLives = 3;
    this.immunityPeriod = 0;
    this.collider.w = 0.45;
    this.collider.h = 0.8;
    this.debug = true;
};

Player.prototype = Object.assign(Object.create(MovableObject.prototype), {
    constructor: Player,
    update: function () {
        MovableObject.prototype.update.call(this);

        // Additional collision checking for player
        this.checkForCollisionWith(game.scene.pickups);
        this.checkForCollisionWith(game.scene.environment);
        this.checkForCollisionWith(game.scene.enemies);

        if (this.immunityPeriod > 0)
            this.immunityPeriod--;

        this.checkForDeath();

        this.animate();
    },
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
    animate: function () {
        var textures = game.textureManager.player,
            speed = this.rigidBody.speed.get(),
            texturePool = textures.idle;
        if (Math.abs(speed.x) > 0.0005)
            texturePool = textures.run;
        if (Math.abs(speed.y) > 0.0005)
            texturePool = textures.jump;
        this.animator.animate(this, texturePool);         // Animate sprite
    },
    hurt: function (dmg) {
        if (this.immunityPeriod == 0) {
            this.currentLives -= dmg;
            this.immunityPeriod = 10;
        }
    },
    checkForDeath: function () {
        // If the player falls from the map, respawn and take 1 heart
        if (this.position.y < -4) {
            this.respawn();
            this.hurt(1);
        }
        // If health reaches 0, reset current level
        if (this.currentLives <= 0) {
            game.hud.menuContent('death');
            game.score = 0;
            this.currentLives = this.maxLives = 3;
            game.loadScene(game.currentLevel + "");
        }
    },
    respawn: function () {
        game.inputManager.clearInput();
        this.position.setv(this.respawnPosition);
        this.rigidBody.isGrounded = false;
        this.rigidBody.resetSpeedAndForce();
    },
    onCollision: function (other, direction) {
        if (other instanceof PickUpObject || other instanceof EnvironmentObject || other instanceof Enemy) {
            other.interact(this, direction);
            return;
        }
        MovableObject.prototype.onCollision.call(this, other, direction);
    }
});