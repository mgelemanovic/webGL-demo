var RigidBody = function (attachedTo, mass) {
    this.attachedTo = attachedTo;
    this.mass = mass;
    this.speed = new Vector(0.0, 0.0);
    this.force = new Vector(0.0, 0.0);
    this.isGrounded = false;
};

RigidBody.prototype = {
    applyForce: function () {
        var elapsed = game.elapsed,
            gAcc = -0.00001,    // Kinda low? Maybe?
            acc = new Vector(this.force.x / this.mass, this.force.y / this.mass);
        this.force.set(0, 0);    // Turn off forces

        this.speed.add(acc.x * elapsed, (gAcc + acc.y) * elapsed);

        // Vertical speed upper limitation
        var upperLimit = 0.005;
        if (this.speed.y > upperLimit)
            this.speed.y = upperLimit;

        this.attachedTo.position.add(this.speed.x * elapsed, this.speed.y * elapsed);
    },
    onGround: function () {
        this.isGrounded = true;
        this.resetSpeedAndForce();
    },
    resetSpeedAndForce: function () {
        this.speed.y = 0.0;
        this.force.set(0.0, 0.0);
    }
};

var Collider = function (attachedTo, width, height) {
    this.attachedTo = attachedTo;
    this.offset = new Vector(0.0, 0.0);
    this.w = width;
    this.h = height;
};

Collider.prototype = {
    render: function() {
        var center = this.center();
        game.textureManager.setActiveTexture(game.textureManager.colors[2]);
        mvPushMatrix();
        mat4.translate(mvMatrix, mvMatrix, [center.x, center.y, this.attachedTo.drawDistance]);
        mat4.scale(mvMatrix, mvMatrix, [this.w, this.h, 1.0]);
        GL.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
        mvPopMatrix();
    },
    center: function() {
        var pos = this.attachedTo.position.get();
        return new Vector(pos.x + this.offset.x, pos.y + this.offset.y);
    },
    checkForCollision: function (other) {
        var tPos = this.center(),
            oPos = other.center(),
            T = new Vector(oPos.x + other.w / 2, oPos.y + other.h / 2),
            B = new Vector(oPos.x - other.w / 2, oPos.y - other.h / 2);

        if (tPos.x - this.w / 2 < T.x &&
            tPos.x + this.w / 2 > B.x &&
            tPos.y - this.h / 2 < T.y &&
            tPos.y + this.h / 2 > B.y) {

            if (tPos.y > T.y)
                return "UP";
            else if (tPos.y < B.y)
                return "DOWN";
            else if (tPos.x > T.x)
                return "RIGHT";
            else if (tPos.x < B.x)
                return "LEFT";
        }
        return "NONE";
    }
};