var Animator = function(attachedTo) {
    this.attachedTo = attachedTo;
    this.frameCount = 0;
    this.nextFrame = 5;
};

Animator.prototype.animate = function() {
    this.frameCount += 1;
    if (this.frameCount > this.nextFrame) {
        this.frameCount = 0;
        this.attachedTo.textureIndex = (this.attachedTo.textureIndex + 1) % this.attachedTo.texturePool.length;
    }
};

Animator.prototype.changeTexturePool = function(newPool) {
    this.attachedTo.texturePool = newPool;
    if (this.attachedTo.textureIndex >= this.attachedTo.texturePool.length)
        this.attachedTo.textureIndex = 0;
};