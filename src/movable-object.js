var MovableObject = function (texture, drawDistance, mass) {
    GameObject.call(this, texture, drawDistance);
    this.rigidBody = {
        // ?????
        mass: mass,
        speedX: 0.0,
        speedY: 0.0,
        forceX: 0.0,
        forceY: 0.0,
        isGrounded: false,
        //
        applyVerticalForce: function (pos) {
            var gAcc = -0.00001;    // Kinda low? Maybe?
            var vAcc = this.forceY / this.mass;
            this.speedY += (gAcc + vAcc) * scene.elapsed;
            pos.y += this.speedY * scene.elapsed;
        },
        applyHorizontalForce: function (pos) {
            var hAcc = this.forceX / this.mass;
            this.speedX += hAcc * scene.elapsed;
            pos.x += this.speedX * scene.elapsed;

        },
        checkForCollision: function (pos, actor, toCheck) {
            if (!wannaJump) // Also messy
                actor.updateCollider(pos);
            if (actor.x < toCheck.x + toCheck.w &&
                actor.x + actor.w > toCheck.x &&
                actor.y < toCheck.y + toCheck.h &&
                actor.h + actor.y > toCheck.y) {
                // collision detected!
                // Messy
                actor.updateCollider({x: pos.x, y: pos.y + 1});
                this.isGrounded = true;
                this.speedY = 0;
                pos.y = toCheck.y + toCheck.h;
            }
        }
        // :(
    };
};

MovableObject.prototype = Object.create(GameObject.prototype);
MovableObject.prototype.constructor = MovableObject;

MovableObject.prototype.move = function () {
    this.rigidBody.applyVerticalForce(this.position);   //No parameters, if possible
    this.rigidBody.applyHorizontalForce(this.position); //Same
    //Change the signature, decouple everything
    this.rigidBody.checkForCollision(this.position, this.collider, ground.collider);
};