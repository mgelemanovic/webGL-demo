var Editor = function () {
    this.isOn = false;
    this.textureIndex = 0;
    this.switchStopper = false;
    this.pools = ['GROUND', 'DECOR', 'PICKUP'];
    this.currentPool = 0;
};

Editor.prototype = {
    changeOnOff: function () {
        game.inputManager.clearInput();
        this.isOn = !this.isOn;
        if (this.isOn)
            canvas.onmousedown = this.handleMouseDown;
        else
            canvas.onmousedown = null;
        game.hud.updateEditor();
    },
    drawUsedObject: function () {
        var texture = game.textureManager.ground;
        if (this.currentPool == 2)
            texture = game.textureManager.hud;

        var editorBlock = new GameObject(texture, this.textureIndex);
        editorBlock.drawDistance = -10;
        editorBlock.position.setv(game.scene.camera);
        editorBlock.position.add(-6.5, 4.5);
        editorBlock.draw();
    },
    changeTextureIndex: function (inc) {
        this.textureIndex += inc;

        var texture = game.textureManager.ground;
        if (this.currentPool == 2) {
            // Only show coin pickup for now
            this.textureIndex = 14;
            texture = game.textureManager.hud;
        }

        if (this.textureIndex < 0) this.textureIndex += texture.length;
        if (this.textureIndex >= texture.length) this.textureIndex = 0;
        game.hud.updateEditor();
    },
    changeObjectPool: function () {
        this.currentPool = (this.currentPool + 1) % this.pools.length;
        // Only show coin pickup for now
        if (this.currentPool == 2) {
            this.textureIndex = 14;
        }
        game.hud.updateEditor();
    },
    handleMouseDown: function (event) {
        var scene = game.scene,
            pool = null,
            tag = "",
            mouse = {
                x: Math.round(scene.camera.x + (event.pageX - canvas.offsetLeft - canvas.width / 2) / 75),
                y: Math.round(scene.camera.y + (event.pageY - canvas.offsetTop - canvas.height / 2) / -75)
            };

        switch (game.editor.currentPool) {
            case 0:
                pool = scene.ground;
                break;
            case 1:
                pool = scene.decor;
                break;
            case 2:
                pool = scene.pickups;
                tag = "CoinPickUp";
                break;
        }

        switch (event.which) {
            case 1:
                pool.push(Factory.create(tag, {pos: mouse, texture: game.editor.textureIndex}));
                break;
            case 2:
                scene.removeObjectFromScene(pool, mouse);
                break;
        }

    },
    handleInput: function () {
        // Pressed right
        if (currentlyPressedKeys[39]) {
            game.scene.camera.x += 0.05;
        }
        // Pressed left
        if (currentlyPressedKeys[37]) {
            game.scene.camera.x -= 0.05;
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
        if (currentlyPressedKeys[70] && !this.switchStopper) {
            game.editor.changeTextureIndex(-1);
            this.switchStopper = true;
        }
        // Pressed g
        if (currentlyPressedKeys[71] && !this.switchStopper) {
            game.editor.changeTextureIndex(1);
            this.switchStopper = true;
        }
        // Pressed h
        if (currentlyPressedKeys[72] && !this.switchStopper) {
            game.editor.changeObjectPool();
            this.switchStopper = true;
        }

        if (!currentlyPressedKeys[70] && !currentlyPressedKeys[71] && !currentlyPressedKeys[72])
            this.switchStopper = false;
    }
};