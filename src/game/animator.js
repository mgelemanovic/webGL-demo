var Animator = function (speed) {
    this.frameCount = 0;
    this.nextFrame = speed;
};

Animator.prototype = {
    animate: function (attachedTo, texturePool) {
        attachedTo.texturePool = texturePool;
        if (attachedTo.textureIndex >= attachedTo.texturePool.length)
            attachedTo.textureIndex = 0;

        this.frameCount += 1;
        if (this.frameCount > this.nextFrame) {
            this.frameCount = 0;
            attachedTo.textureIndex = (attachedTo.textureIndex + 1) % attachedTo.texturePool.length;
        }
    }
};