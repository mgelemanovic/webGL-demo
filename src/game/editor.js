var Editor = function () {
    this.isOn = false;
    this.textureIndex = 0;
    this.switchStopper = false;
    this.pools = ['GROUND', 'DECOR', 'PICKUP'];
    this.currentPool = 0;
};

Editor.prototype.changeOnOff = function () {
    game.inputManager.clearInput();
    this.isOn = !this.isOn;
    if (this.isOn)
        canvas.onmousedown = this.handleMouseDown;
    else
        canvas.onmousedown = null;
    game.hud.updateEditor(this.pools[this.currentPool], this.textureIndex + 1);
};

Editor.prototype.drawUsedObject = function () {
    var texture = game.textureManager.ground;
    if (this.currentPool == 2)
        texture = game.textureManager.hud;

    var editorBlock = new GameObject(texture, this.textureIndex);
    editorBlock.drawDistance = -10;
    editorBlock.position.set(game.scene.camera.x - 6.5, game.scene.camera.y + 4.5);
    editorBlock.draw();
};

Editor.prototype.changeTextureIndex = function (inc) {
    this.textureIndex += inc;

    var texture = game.textureManager.ground;
    if (this.currentPool == 2) {
        // Only show coin pickup for now
        this.textureIndex = 14;
        texture = game.textureManager.hud;
    }

    if (this.textureIndex < 0) this.textureIndex += texture.length;
    if (this.textureIndex >= texture.length) this.textureIndex = 0;
    game.hud.updateEditor(this.pools[this.currentPool], this.textureIndex + 1);
};

Editor.prototype.changeObjectPool = function () {
    this.currentPool = (this.currentPool + 1) % this.pools.length;
    // Only show coin pickup for now
    if (this.currentPool == 2) {
        this.textureIndex = 14;
    }
    game.hud.updateEditor(this.pools[this.currentPool], this.textureIndex + 1);
};

Editor.prototype.handleMouseDown = function (event) {
    var scene = game.scene,
        mouse = {
            x: Math.round(scene.camera.x + (event.pageX - canvas.offsetLeft - canvas.width / 2) / 75),
            y: Math.round(scene.camera.y + (event.pageY - canvas.offsetTop - canvas.height / 2) / -75)
        },
        pool = null,
        texture = game.textureManager.ground,
        object = GameObject;

    switch (game.editor.currentPool) {
        case 0:
            pool = scene.ground;
            break;
        case 1:
            pool = scene.decor;
            break;
        case 2:
            pool = scene.pickups;
            texture = game.textureManager.hud;
            object = PickUpObject;
            break;
    }

    switch (event.which) {
        case 1:
            scene.addObjectToScene(pool, new object(texture, game.editor.textureIndex), mouse);
            break;
        case 2:
            scene.removeObjectFromScene(pool, mouse);
            break;
    }

};

Editor.prototype.handleInput = function () {
    // Pressed right
    if (currentlyPressedKeys[39]) {
        game.scene.camera.x += 0.05;
    }
    // Pressed left
    if (currentlyPressedKeys[37]) {
        game.scene.camera.x -= 0.05;
    }
    // Pressed s
    if (currentlyPressedKeys[83]) {
        game.saveScene("scene.json");
        currentlyPressedKeys[83] = false;
    }
    // Pressed e
    if (currentlyPressedKeys[69]) {
        var player = game.scene.player;
        player.respawn();
        player.currentLives = player.maxLives;
        game.editor.changeOnOff();
        currentlyPressedKeys[69] = false;
    }
    // Pressed f
    if (currentlyPressedKeys[70]) {
        if (!this.switchStopper) {
            game.editor.changeTextureIndex(-1);
            this.switchStopper = true;
        }
    }

    // Pressed g
    if (currentlyPressedKeys[71]) {
        if (!this.switchStopper) {
            game.editor.changeTextureIndex(1);
            this.switchStopper = true;
        }
    }

    // Pressed h
    if (currentlyPressedKeys[72]) {
        if (!this.switchStopper) {
            game.editor.changeObjectPool();
            this.switchStopper = true;
        }
    }

    if (!currentlyPressedKeys[70] && !currentlyPressedKeys[71] && !currentlyPressedKeys[72]) {
        this.switchStopper = false;
    }
};