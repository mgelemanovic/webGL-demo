var RigidBody = function (texturePool, textureIndex) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "RigidBody";
    this.speed = new Vector(0.0, 0.0);
    this.onGround = false;
};

RigidBody.prototype = Object.assign(Object.create(GameObject.prototype), {
    constructor: RigidBody,
    update: function () {
        this.applyPhysics();                            // Update physics
        this.checkForCollisionWith(game.scene.ground);  // Check for collisions with ground
    },
    applyPhysics: function () {
        var step = game.elapsed / 1000,
            gravity = -9.81;

        this.speed.y += gravity * step;
        this.position.add(this.speed.x * step, this.speed.y * step);
    },
    grounded: function () {
        this.onGround = true;
        this.speed.y = 0;
    },
    checkForCollisionWith: function (pool) {
        for (var i = 0; i < pool.length; ++i) {
            if (Math.abs(this.position.x - pool[i].position.x) <= 1 && Math.abs(this.position.y - pool[i].position.y) <= 1) {
                var direction = this.collider.checkForCollision(pool[i].collider);
                if (direction == "NONE") continue;
                this.onCollision(pool[i], direction);
            }
        }
    },
    onCollision: function (other, direction) {
        var tCol = this.collider,
            oPos = other.collider.center(),
            oCol = other.collider;

        switch (direction) {
            case "UP":
                this.grounded();
                this.position.y = oPos.y + (oCol.h + tCol.h) / 2 - tCol.offset.y;
                break;
            case "DOWN":
                this.speed.y = 0;
                this.position.y = oPos.y - (oCol.h + tCol.h) / 2 - tCol.offset.y;
                break;
            case "RIGHT":
                this.position.x = oPos.x + (oCol.w + tCol.w) / 2 - tCol.offset.x;
                break;
            case "LEFT":
                this.position.x = oPos.x - (oCol.w + tCol.w) / 2 - tCol.offset.x;
                break;
        }
    }
});