var Animator = function(attachedTo, textures) {
    this.attachedTo = attachedTo;
    this.textures = textures;
    this.frameCount = 0;
    this.nextFrame = 5;
};

Animator.prototype.animate = function() {
    var speed = this.attachedTo.rigidBody.speed.get(),
        texturePool = this.textures.idle;
    if (Math.abs(speed.x) > 0.0005)
        texturePool = this.textures.run;
    if (Math.abs(speed.y) > 0.0005)
        texturePool = this.textures.jump;

    this.attachedTo.texturePool = texturePool;
    if (this.attachedTo.textureIndex >= this.attachedTo.texturePool.length)
        this.attachedTo.textureIndex = 0;

    this.frameCount += 1;
    if (this.frameCount > this.nextFrame) {
        this.frameCount = 0;
        this.attachedTo.textureIndex = (this.attachedTo.textureIndex + 1) % this.attachedTo.texturePool.length;
    }
};