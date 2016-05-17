var Editor = function () {
    this.isOn = false;
    this.selectOn = false;
    this.switchStopper = false;
    this.decorFlag = false;
    this.usedObj = new GameObject(game.textureManager.ground, 0);
    this.allObj = [];
};

Editor.prototype = {
    initEditor: function () {
        while (game.scene.removed.length > 0) {
            var obj = game.scene.removed.pop();
            Factory(obj.tag, {pos: obj.position, texture: obj.textureIndex});
        }
        if (this.allObj.length != 0) return;
        for (var prop in Creator)
            this.allObj = this.allObj.concat(Creator[prop].editor());
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
            player.currentLives = player.maxLives = 3;
            game.score = 0;
            this.selectOn = false;
            canvas.onmousedown = null;
        }
    },
    drawUsedObject: function () {
        this.usedObj.drawDistance = -10;
        this.usedObj.position.setv(game.scene.camera.position);
        this.usedObj.position.add(10.5, -4.5);
        this.usedObj.render();
    },
    drawObjectSelection: function () {
        var shadow;
        if (this.decorFlag)
            shadow = new GameObject(game.textureManager.colors, 1);
        else
            shadow = new GameObject(game.textureManager.colors, 0);
        shadow.drawDistance = -0.1;
        shadow.position.setv(game.scene.camera.position);
        shadow.render();

        for (var i = 0; i < Math.ceil(this.allObj.length / 9); ++i) {
            for (var j = 0; j < 9; ++j) {
                var index = i * 9 + j;
                if (index == this.allObj.length) return;

                var obj = this.allObj[index];
                obj.drawDistance = -7;
                obj.position.setv(game.scene.camera.position);
                obj.position.add(j - 4, 3 - i);
                obj.scale.set(0.8, 0.8);
                obj.render();
            }
        }
    },
    putNewBlock: function (event) {
        var objectTag = game.editor.usedObj.tag,
            camera = game.scene.camera.position,
            factor = 75,
            mouse = {
                x: Math.round(camera.x + (event.pageX - canvas.offsetLeft - canvas.width / 2) / factor),
                y: Math.round(camera.y + (event.pageY - canvas.offsetTop - canvas.height / 2) / -factor)
            };

        if (game.editor.decorFlag && objectTag == "GameObject")
            objectTag = "DecorObject";

        switch (event.which) {
            case 1:
                Factory(objectTag, {pos: mouse, texture: game.editor.usedObj.textureIndex});
                break;
            case 2:
                game.scene.removeObjectFromScene(Creator[objectTag].pool(), mouse);
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
            game.scene.camera.position.x += 0.05;
        }
        // Pressed left
        if (currentlyPressedKeys[37]) {
            game.scene.camera.position.x -= 0.05;
        }
        // Pressed up
        if (currentlyPressedKeys[38]) {
            game.scene.camera.position.y += 0.05;
        }
        // Pressed down
        if (currentlyPressedKeys[40]) {
            game.scene.camera.position.y -= 0.05;
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