var HUD = function () {
    this.menus = [];

    this.fps = {
        node: document.createTextNode("0"),
        counter: 0,
        visible: false,
        toggle: function() {
            this.visible = !this.visible;
            if (this.visible)
                document.getElementById("fpsMenu").style.visibility = "visible";
            else
                document.getElementById("fpsMenu").style.visibility = "hidden";
        }
    };
    document.getElementById("fps").appendChild(this.fps.node);
};

HUD.prototype = {
    init: function (id) {
        switch (id) {
            case "death":
                return "<p>Too bad, you died!<br/>Your score: " + game.score + "</p>" +
                    "<button onclick='game.hud.closeMenu();'>TRY AGAIN</button>";
            case "victory":
                return "<p>Great job!<br/>Your score: " + game.score + "</p>" +
                    "<button onclick='game.hud.closeMenu();'>NEXT LEVEL</button>";
            case "scene":
                return "<h1>SCENE MANAGEMENT</h1><hr/>" +
                    "<p onclick='game.saveScene();'>DOWNLOAD SCENE</p>" +
                    "<p onclick='game.uploadScene();'>UPLOAD SCENE</p>" +
                    "<p onclick='game.hud.closeMenu();'>BACK</p>";
            case "editorIntro":
                if (!game.editor.isOn)
                    return "<h1>EDITOR</h1><hr/>" +
                        "<p onclick='game.editor.changeMode(); game.loadScene(\"empty\");'>CREATE NEW SCENE</p>" +
                        "<p onclick='game.editor.changeMode();'>EDIT CURRENT SCENE</p>" +
                        "<p onclick='game.hud.closeMenu();'>BACK</p>";
                else {
                    return "<h1>EDITOR</h1><hr/>" +
                        "<p onclick='game.editor.changeMode();'>PLAY SCENE</p>" +
                        "<p>OBJECT SELECTION (Q / GRAY)<br/>" +
                        "DECOR MODE (W / BLUE)<br/>" +
                        "DELETE MODE (E / RED)</p>" +
                        "<p onclick='game.hud.closeMenu();'>BACK</p>";
                }
            case "customization":
                return "<h1>CUSTOMIZATION</h1><hr/>" +
                    "<p onclick='game.hud.hideInfo(\"customization\"); game.hud.info(\"player\", 500, 150);'>PLAYER</p>" +
                    "<p onclick='game.hud.hideInfo(\"customization\"); game.hud.info(\"biome\", 500, 150);'>BIOME</p>" +
                    "<p onclick='document.getElementById(\"startMenu\").style.visibility = \"visible\"; game.hud.hideInfo(\"customization\");'>BACK</p>";
            case "player":
                return "<h1>CHOOSE PLAYER</h1><hr/>" +
                    "<p onclick='game.loadPlayerTextures(\"robot\");'>ROBOT</p>" +
                    "<p onclick='game.loadPlayerTextures(\"adventurer\");'>ADVENTURER</p> " +
                    "<p onclick='game.hud.hideInfo(\"player\"); game.hud.info(\"customization\", 500, 150);'>BACK</p>";
            case "biome":
                return "<h1>CHOOSE BIOME</h1><hr/>" +
                    "<p onclick='game.loadBiomeTextures(\"grass\");'>GRASS</p>" +
                    "<p onclick='game.loadBiomeTextures(\"snow\");'>SNOW</p> " +
                    "<p onclick='game.loadBiomeTextures(\"desert\");'>DESERT</p> " +
                    "<p onclick='game.hud.hideInfo(\"biome\"); game.hud.info(\"customization\", 500, 150);'>BACK</p>";
            case "debug":
                return "<h1>DEBUG OPTIONS</h1><hr/>" +
                    "<p onclick='game.hud.fps.toggle();'>TOGGLE FPS</p>" +
                    "<p onclick='game.player.toggleCollider();'>PLAYER COLLIDER</p>" +
                    "<p onclick='game.scene.togglePoolCollider(game.scene.ground);'>GROUND COLLIDERS</p>" +
                    "<p onclick='game.scene.togglePoolCollider(game.scene.enemies);'>ENEMY COLLIDERS</p>" +
                    "<p onclick='game.scene.togglePoolCollider(game.scene.environment);'>ENVIRONMENT COLLIDERS</p>" +
                    "<p onclick='game.scene.togglePoolCollider(game.scene.pickups);'>PICKUP COLLIDERS</p>" +
                    "<p onclick='game.hud.closeMenu();'>BACK</p>";
            default:
                return "";
        }
    },
    render: function () {
        var hudElement = new GameObject(game.textureManager.hud, 13),
            camera = game.scene.camera.position,
            maxLives = game.player.maxLives,
            currentLives = game.player.currentLives,
            score = game.score,
            position = 10.5,
            i;

        var drawElement = function (offset) {
            hudElement.position.x = camera.x + offset;
            hudElement.render();
        };

        hudElement.position.y = camera.y + 4.5;
        hudElement.drawDistance = -10;

        // Health rendering
        for (i = 0; i < Math.floor(currentLives); ++i) {
            drawElement(i - position);
        }
        if (currentLives - i == 0.5) {
            hudElement.textureIndex = 12;
            drawElement(i - position);
            ++i;
        }
        hudElement.textureIndex = 11;
        for (; i < maxLives; ++i) {
            drawElement(i - position);
        }

        // Score rendering
        hudElement.textureIndex = 14;
        drawElement(position - 2);
        hudElement.textureIndex = 10;
        drawElement(position - 1.25);
        hudElement.textureIndex = Math.floor(score / 10) % 10;
        drawElement(position - 0.5);
        hudElement.textureIndex = score % 10;
        drawElement(position);
    },
    menu: function (menu) {
        if (this.menus.length == 0)
            this.showMenu(menu);
        else while (this.menus.length > 0)
            this.closeMenu();
    },
    showMenu: function (menu) {
        var n = this.menus.length;
        if (n == 0)
            game.pause();
        else {
            var last = this.menus.pop();
            document.getElementById(last).style.visibility = "hidden";
            this.menus.push(last);
        }
        document.getElementById(menu).style.visibility = "visible";
        this.menus.push(menu);
    },
    closeMenu: function () {
        var last;
        if (this.menus.length > 0) {
            last = this.menus.pop();
            document.getElementById(last).style.visibility = "hidden";
        }
        if (this.menus.length > 0) {
            last = this.menus.pop();
            document.getElementById(last).style.visibility = "visible";
            this.menus.push(last);
        } else
            game.pause();
    },
    createMenu: function (id) {
        var menu = document.createElement("DIV");
        menu.className = "menu";
        menu.id = id;
        menu.innerHTML = this.init(id);
        return menu;
    },
    menuContent: function (id) {
        var menu = this.createMenu(id);
        if (menu.innerHTML == "") return;
        var div = document.getElementById("container");
        div.replaceChild(menu, div.childNodes[2]);
        this.showMenu(id);
    },
    info: function (id, x, y) {
        var menu = this.createMenu(id);
        if (menu.innerHTML == "") return;
        menu.style.visibility = "visible";
        menu.style.left = x;
        menu.style.top = y;
        var div = document.getElementById("container");
        div.replaceChild(menu, div.childNodes[4]);
    },
    hideInfo: function (id) {
        document.getElementById(id).style.visibility = "hidden";
    },
    updateFPS: function (elapsed) {
        this.fps.counter += elapsed;
        if (this.fps.counter >= 50) {
            this.fps.node.nodeValue = (1000 / elapsed).toFixed(0);
            this.fps.counter = 0;
        }
    }
};