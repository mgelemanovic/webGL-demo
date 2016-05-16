var PickUpObject = function (texturePool, textureIndex) {
    GameObject.call(this, texturePool, textureIndex);
    this.tag = "PickUp";
    this.setScale(0.75, 0.75);
};

PickUpObject.prototype = Object.assign(Object.create(GameObject.prototype), {
    constructor: PickUpObject,
    interact: function (other, direction) {
        game.scene.removeObjectFromScene(game.scene.pickups, this.position);
    }
});

var CoinPickUpObject = function (index) {
    var value = 1;
    if (index == 1) value = 2;
    else if (index == 2) value = 5;
    else if (index == 3) value = 15;
    PickUpObject.call(this, game.textureManager.items, index);
    this.tag = "CoinPickUp";
    this.value = value;
};

CoinPickUpObject.prototype = Object.assign(Object.create(PickUpObject.prototype), {
    constructor: CoinPickUpObject,
    interact: function (other, direction) {
        PickUpObject.prototype.interact.call(this, other, direction);
        var before = Math.floor(game.score / 10) % 10;
        game.score += this.value;
        var after = Math.floor(game.score / 10) % 10;
        if (before == 9 && after == 0 && game.player.maxLives <= 8) {
            game.player.maxLives++;
            game.player.heal(1);
        }
    }
});

var StarPickUpObject = function () {
    PickUpObject.call(this, game.textureManager.items, 7);
    this.tag = "StarPickUp";
};

StarPickUpObject.prototype = Object.assign(Object.create(PickUpObject.prototype), {
    constructor: StarPickUpObject,
    interact: function (other, direction) {
        PickUpObject.prototype.interact.call(this, other, direction);
        game.hud.menuContent('victory');
        game.nextLevel();
    }
});

var HeartPickUpObject = function () {
    PickUpObject.call(this, game.textureManager.items, 11);
    this.tag = "HeartPickUp";
};

HeartPickUpObject.prototype = Object.assign(Object.create(PickUpObject.prototype), {
    constructor: HeartPickUpObject,
    interact: function (other, direction) {
        if (other.currentLives < other.maxLives) {
            PickUpObject.prototype.interact.call(this, other, direction);
            other.heal(1);
        }
    }
});

Creator["CoinPickUp"] = {
    create: function (info) {
        return new CoinPickUpObject(info.texture);
    },
    pool: function () {
        return game.scene.pickups;
    }
};

Creator["StarPickUp"] = {
    create: function (info) {
        return new StarPickUpObject();
    },
    pool: function () {
        return game.scene.pickups;
    }
};

Creator["HeartPickUp"] = {
    create: function (info) {
        return new HeartPickUpObject();
    },
    pool: function () {
        return game.scene.pickups;
    }
};