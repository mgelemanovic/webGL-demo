var Editor = function () {
    this.isOn = false;
    this.selectOn = false;
    this.switchStopper = false;
    this.decorFlag = false;
    this.usedObj = {tag: "StaticObject", texture: null, index: 0};
    this.allObj = [];
};

Editor.prototype = {
    initEditor: function () {
        if (this.allObj.length != 0) return;
        var self = this,
            textMng = game.textureManager,
            fillUp = function (start, end, tag, texture) {
                for (var j = start; j < end; ++j) {
                    self.allObj.push({tag: tag, texture: texture, index: j});
                }
            };
        this.usedObj = {tag: "StaticObject", pool: game.scene.ground, texture: game.textureManager.ground, index: 0};
        fillUp(0, textMng.ground.length, "StaticObject", textMng.ground);
        fillUp(16, 20, "DecorObject", textMng.items);
        fillUp(0, 3, "CoinPickUp", textMng.items);
        fillUp(7, 8, "Spikes", textMng.items);
        fillUp(12, 13, "Checkpoint", textMng.items);
        fillUp(0, 1, "SlimeEnemy", textMng.enemy.slime);
        fillUp(3, 4, "StarPickUp", textMng.items);
    },
    loop: function () {
        this.handleInput();          // Handle editor input

        game.scene.render();         // Render game world
        if (this.selectOn)
            this.drawObjectSelection();
        this.drawUsedObject();
    },
    changeMode: function () {
        game.hud.menu("mainMenu");
        game.inputManager.clearInput();
        this.isOn = !this.isOn;
        if (this.isOn) {
            canvas.onmousedown = this.putNewBlock;
            this.initEditor();
        } else {
            var player = game.player;
            player.respawn();
            player.currentLives = player.maxLives;
            this.selectOn = false;
            canvas.onmousedown = null;
        }
    },
    drawUsedObject: function () {
        var editorBlock = new GameObject(this.usedObj.texture, this.usedObj.index);
        editorBlock.drawDistance = -10;
        editorBlock.position.setv(game.scene.camera);
        editorBlock.position.add(10.5, -4.5);
        editorBlock.render();
    },
    drawObjectSelection: function () {
        var shadow;
        if (this.decorFlag)
            shadow = new GameObject(game.textureManager.colors, 1);
        else
            shadow = new GameObject(game.textureManager.colors, 0);
        shadow.drawDistance = -0.1;
        shadow.position.setv(game.scene.camera);
        shadow.render();

        var len = Math.ceil(this.allObj.length / 9);
        for (var i = 0; i < len; ++i) {
            for (var j = 0; j < 9; ++j) {
                var index = i * 9 + j;
                if (index == this.allObj.length) return;
                var objInfo = this.allObj[index];
                var obj = new GameObject(objInfo.texture, objInfo.index);
                obj.drawDistance = -7;
                obj.position.setv(game.scene.camera);
                obj.position.add(j - 4, 3 - i);
                obj.scale.set(0.8, 0.8);
                obj.render();
            }
        }
    },
    putNewBlock: function (event) {
        var scene = game.scene,
            obj = game.editor.usedObj,
            pool = null,
            factor = 75,
            mouse = {
                x: Math.round(scene.camera.x + (event.pageX - canvas.offsetLeft - canvas.width / 2) / factor),
                y: Math.round(scene.camera.y + (event.pageY - canvas.offsetTop - canvas.height / 2) / -factor)
            };

        switch (obj.tag) {
            case "CoinPickUp":
            case "StarPickUp":
                pool = game.scene.pickups;
                break;
            case "Spikes":
            case "Checkpoint":
                pool = game.scene.environment;
                break;
            case "DecorObject":
                pool = game.scene.decor;
                break;
            case "SlimeEnemy":
                pool = game.scene.enemies;
                break;
            default:
                if (game.editor.decorFlag)
                    pool = game.scene.decor;
                else
                    pool = game.scene.ground;
                break;
        }

        switch (event.which) {
            case 1:
                pool.push(Factory.create(obj.tag, {pos: mouse, texture: obj.index}));
                break;
            case 2:
                scene.removeObjectFromScene(pool, mouse);
                break;
        }
    },
    selectNewBlock: function (event) {
        var mouse = {
            x: 4 + Math.round((event.pageX - canvas.offsetLeft - canvas.width / 2) / 75),
            y: 3 - Math.round((event.pageY - canvas.offsetTop - canvas.height / 2) / -75)
        };
        var index = mouse.y * 9 + mouse.x;
        if (index > game.editor.allObj.length || index < 0) return;
        game.editor.usedObj = game.editor.allObj[index];
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
        // Pressed h
        if (currentlyPressedKeys[72] && !this.switchStopper) {
            this.selectOn = !this.selectOn;
            if (this.selectOn)
                canvas.onmousedown = this.selectNewBlock;
            else
                canvas.onmousedown = this.putNewBlock;
            this.switchStopper = true;
        }
        // Pressed g
        if (currentlyPressedKeys[71] && !this.switchStopper) {
            this.decorFlag = !this.decorFlag;
            this.switchStopper = true;
        }

        if (!currentlyPressedKeys[71] && !currentlyPressedKeys[72])
            this.switchStopper = false;
    }
};