Factory = {
    create: function (tag, info) {
        var object;
        switch (tag) {
            case "CoinPickUp":
                object = this.createCoinPickUp(info);
                break;
            default:
                object = this.createStaticObject(info);
        }
        object.position.setv(info.pos);
        if (info.scale)
            object.scale.setv(info.scale);
        return object;
    },
    createBackground: function() {
        var bg = new GameObject(game.textureManager.background, 0);
        bg.drawDistance = -0.5;
        return bg;
    },
    createPlayer: function (mass, respawn) {
        var player = new Player(mass);
        if (respawn)
            player.respawnPosition.setv(respawn);
        player.respawn();
        return player;
    },
    createStaticObject: function (info) {
        var textureIndex = 0;
        if (info.texture)
            textureIndex = info.texture;
        return new GameObject(game.textureManager.ground, textureIndex);
    },
    createCoinPickUp: function (info) {
        return new CoinPickUpObject(info.texture);
    }
};