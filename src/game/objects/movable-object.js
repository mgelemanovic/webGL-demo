var MovableObject = function (texturePool, textureIndex, mass) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "DynamicObject";
    this.rigidBody = new RigidBody(this, mass);
};

MovableObject.prototype = Object.assign(Object.create(GameObject.prototype), {
    constructor: MovableObject,
    update: function () {
        this.rigidBody.applyForce();                    // Update physics
        this.checkForCollisionWith(game.scene.ground);  // Check for collisions with ground
    },
    checkForCollisionWith: function(pool) {
        for (var i = 0; i < pool.length; ++i) {
            if (this.position.x - pool[i].position.x <= 1 && this.position.y - pool[i].position.y <= 1) {
                var direction = this.collider.checkForCollision(pool[i].collider);
                if (direction == "NONE") continue;
                this.onCollision(pool[i], direction);
            }
        }
    },
    onCollision: function (other, direction) {
        var tPos = this.position.get(),
            tCol = this.collider,
            oPos = other.position.get(),
            oCol = other.collider;

        switch (direction) {
            case "UP":
                this.rigidBody.onGround();
                this.position.set(tPos.x, oPos.y + (oCol.h + tCol.h) / 2);
                break;
            case "DOWN":
                this.position.set(tPos.x, oPos.y - (oCol.h + tCol.h) / 2);
                break;
            case "RIGHT":
                this.position.set(oPos.x + (oCol.w + tCol.w) / 2, tPos.y);
                break;
            case "LEFT":
                this.position.set(oPos.x - (oCol.w + tCol.w) / 2, tPos.y);
                break;
        }
    }
});