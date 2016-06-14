var Player = function () {
    RigidBody.call(this, game.textureManager.player, 0);
    this.tag = "Player";
    this.animator = new Animator(5);
    this.respawnPosition = new Vector(0, 0);
    this.currentLives = this.maxLives = 3;
    this.immunityPeriod = 0;
    this.collider.w = 0.5;
    this.collider.h = 0.8;
    this.doubleJumpReady = true;     // Double jump functionality
};

Player.prototype = Object.assign(Object.create(RigidBody.prototype), {
    constructor: Player,
    update: function () {
        RigidBody.prototype.update.call(this);

        // Additional collision checking for player
        this.checkForCollisionWith(game.scene.pickups);
        this.checkForCollisionWith(game.scene.environment);
        this.checkForCollisionWith(game.scene.enemies);

        if (this.immunityPeriod > 0)
            this.immunityPeriod -= game.elapsed;

        this.checkForDeath();

        this.animate();
    },
    move: function (direction) {
        if (direction == "STOP") {
            this.speed.x = 0;
            return;
        }
        var moveSpeed = 4;
        if (direction == "LEFT") {
            this.speed.x = -moveSpeed;
            this.scale.x = -Math.abs(this.scale.x);
        } else if (direction == "RIGHT") {
            this.speed.x = moveSpeed;
            this.scale.x = Math.abs(this.scale.x);
        }
    },
    jump: function () {
        var jumpSpeed = 5;
        if (this.onGround) {
            this.onGround = false;
            this.speed.y = jumpSpeed;
        }
        // Double jump functionality
        else if (this.doubleJumpReady) {
            this.doubleJumpReady = false;
            this.speed.y = jumpSpeed;
        }
    },
    animate: function () {
        var speed = this.speed.get(),
            texturePool = game.textureManager.player.slice(0, 10);      // Idle textures
        if (Math.abs(speed.x) > 0.5)
            texturePool = game.textureManager.player.slice(10, 18);     // Run textures
        if (Math.abs(speed.y) > 0.5)
            texturePool = game.textureManager.player.slice(20, 30);     // Jump textures
        this.animator.animate(this, texturePool);
    },
    hurt: function (dmg) {
        if (this.immunityPeriod <= 0) {
            this.currentLives -= dmg;
            this.immunityPeriod = 1000;     // 1 second period
        }
    },
    bounce: function (speed) {
        this.grounded();
        this.doubleJumpReady = false;
        this.speed.y = speed;
    },
    heal: function (hp) {
        this.currentLives = Math.min(this.maxLives, this.currentLives + hp);
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
        this.onGround = false;
        this.speed = new Vector(0, 0);
    },
    onCollision: function (other, direction) {
        if (other instanceof PickUpObject || other instanceof EnvironmentObject || other instanceof Enemy) {
            other.interact(this, direction);
            return;
        }
        RigidBody.prototype.onCollision.call(this, other, direction);
        // Double jump functionality
        if (direction == "UP")
            this.doubleJumpReady = true;
    },
    toggleCollider: function () {
        this.debug = !this.debug;
        game.scene.render();
        this.render();
        game.hud.render();
    }
});