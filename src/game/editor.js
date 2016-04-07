var Editor = function () {
    this.isOn = false;
    this.textureIndex = 0;
    this.switchStopper = false;
    this.pools = ['GROUND', 'DECOR'];
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
    var editorBlock = new GameObject(game.textureManager.ground, this.textureIndex);
    editorBlock.drawDistance = -10;
    editorBlock.position.set(game.scene.camera.x - 6.5, game.scene.camera.y + 4.5);
    editorBlock.draw();
};

Editor.prototype.changeTextureIndex = function (inc) {
    this.textureIndex += inc;
    if (this.textureIndex == -1) this.textureIndex += game.textureManager.ground.length;
    if (this.textureIndex == game.textureManager.ground.length) this.textureIndex = 0;
    game.hud.updateEditor(this.pools[this.currentPool], this.textureIndex + 1);
};

Editor.prototype.changeObjectPool = function() {
    this.currentPool = (this.currentPool + 1) % this.pools.length;
    game.hud.updateEditor(this.pools[this.currentPool], this.textureIndex + 1);
};

Editor.prototype.handleMouseDown = function (event) {
    var mouseClickPos = {
        x: Math.round(game.scene.camera.x + (event.pageX - canvas.offsetLeft - canvas.width / 2) / 100),
        y: Math.round(game.scene.camera.y + (event.pageY - canvas.offsetTop - canvas.height / 2) / -100)
    };

    var pool = null;
    switch (game.editor.currentPool) {
        case 0:
            pool = game.scene.ground;
            break;
        case 1:
            pool = game.scene.decor;
            break;
    }

    switch (event.which) {
        case 1:
            game.scene.addObjectToScene(pool, new GameObject(game.textureManager.ground, game.editor.textureIndex), mouseClickPos, {
                x: 1,
                y: 1
            });
            break;
        case 2:
            game.scene.removeObjectFromScene(pool, game.scene.checkForCoords(pool, mouseClickPos));
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
        game.saveScene("newScene.json");
        currentlyPressedKeys[83] = false;
    }
    // Pressed e
    if (currentlyPressedKeys[69]) {
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