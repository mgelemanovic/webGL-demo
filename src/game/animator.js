var Animator = function (speed) {
    this.frameCount = 0;
    this.nextFrame = speed;
};

Animator.prototype = {
    animate: function (attachedTo, texturePool) {
        if (attachedTo.textureIndex >= texturePool.length)
            attachedTo.textureIndex = 0;
        attachedTo.texturePool = texturePool;

        this.frameCount += 1;
        if (this.frameCount > this.nextFrame) {
            this.frameCount = 0;
            attachedTo.textureIndex = (attachedTo.textureIndex + 1) % texturePool.length;
        }
    }
};