var HUD = function () {
    this.menus = [];
};

HUD.prototype = {
    render: function () {
        var hudElement = new GameObject(game.textureManager.hud, 13),
            camera = game.scene.camera,
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
    deathMenu: function () {
        var deathScreen = document.createElement("DIV");
        deathScreen.className = "menu";
        deathScreen.id = "death";
        deathScreen.innerHTML += "<p>Too bad, you died!<br/>Your score: " + game.score + "</p>";
        deathScreen.innerHTML += "<button onclick='game.hud.closeMenu();'>TRY AGAIN</button>";
        var div = document.getElementById("container");
        div.replaceChild(deathScreen, div.childNodes[2]);
        this.showMenu("death");
    },
    victoryMenu: function () {
        var deathScreen = document.createElement("DIV");
        deathScreen.className = "menu";
        deathScreen.id = "victory";
        deathScreen.innerHTML += "<p>Great job!<br/>Your score: " + game.score + "</p>";
        deathScreen.innerHTML += "<button onclick='game.hud.closeMenu();'>NEXT LEVEL</button>";
        var div = document.getElementById("container");
        div.replaceChild(deathScreen, div.childNodes[2]);
        this.showMenu("victory");
    }
};