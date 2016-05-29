var Editor = function () {
    this.isOn = this.selectOn = false;
    this.decorFlag = this.deleteFlag = false;
    this.usedObj = new GameObject(game.textureManager.ground, 0);
    this.allObj = [];
};

Editor.prototype = {
    initEditor: function () {
        while (game.scene.removed.length > 0) {
            var obj = game.scene.removed.pop();
            Factory({pos: obj.position, tag: obj.tag, texture: obj.textureIndex});
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
            this.selectOn = this.decorFlag = false;
            canvas.onmousedown = null;
        }
    },
    drawUsedObject: function () {
        if (!this.selectOn) {
            var shadow = new GameObject(game.textureManager.colors, 0);
            if (this.decorFlag)
                shadow.textureIndex = 1;
            if (this.deleteFlag)
                shadow.textureIndex = 3;
            shadow.drawDistance = -10;
            shadow.scale = new Vector(1.5, 1.5);
            shadow.position.setv(game.scene.camera.position);
            shadow.position.add(11, -4.75);
            shadow.render();
        }

        this.usedObj.drawDistance = -10;
        this.usedObj.position.setv(game.scene.camera.position);
        this.usedObj.position.add(11, -4.75);
        this.usedObj.render();
    },
    drawObjectSelection: function () {
        var shadow = new GameObject(game.textureManager.colors, 0);
        if (this.decorFlag)
            shadow.textureIndex = 1;
        if (this.deleteFlag)
            shadow.textureIndex = 3;
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

        if (event.which == 1) {
            if (game.editor.deleteFlag)
                game.editor.deleteBlock(mouse);
            else
                Factory({pos: mouse, tag: objectTag, texture: game.editor.usedObj.textureIndex});
        }
    },
    selectNewBlock: function (event) {
        var mouse = {
            x: 4 + Math.round((event.pageX - canvas.offsetLeft - canvas.width / 2) / 75),
            y: 3 - Math.round((event.pageY - canvas.offsetTop - canvas.height / 2) / -75)
        };
        if (event.which == 1) {
            var index = mouse.y * 9 + mouse.x;
            if (index > game.editor.allObj.length || index < 0) return;
            game.editor.usedObj = game.editor.allObj[index];
        }
    },
    deleteBlock: function (position) {
        var pool = [],
            scene = game.scene;
        pool.push(scene.ground, scene.decor, scene.pickups, scene.enemies, scene.environment);
        for (var i = 0; i < pool.length; ++i) {
            for (var j = 0; j < pool[i].length; ++j) {
                if (Math.abs(position.x - pool[i][j].position.x) < 0.5 && Math.abs(position.y - pool[i][j].position.y) < 0.5)
                    pool[i].splice(j, 1);
            }
        }
    },
    toggleSelector: function (mode) {
        this.selectOn = mode;
        if (this.selectOn)
            canvas.onmousedown = this.selectNewBlock;
        else
            canvas.onmousedown = this.putNewBlock;
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

        this.toggleSelector(currentlyPressedKeys[81]);
        this.decorFlag = currentlyPressedKeys[87];
        this.deleteFlag = currentlyPressedKeys[69];
    }
};