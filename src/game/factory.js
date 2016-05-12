Factory = {
    create: function (tag, info) {
        var object;
        switch (tag) {
            case "CoinPickUp":
                object = new CoinPickUpObject(info.texture);
                break;
            case "StarPickUp":
                object = new StarPickUpObject();
                break;
            case "Spikes":
                object = new SpikesObject();
                break;
            case "DecorObject":
                object = this.createStaticObject(game.textureManager.items, info);
                object.tag = "DecorObject";
                break;
            default:
                object = this.createStaticObject(game.textureManager.ground, info);
        }
        object.position.setv(info.pos);
        if (info.scale)
            object.scale.setv(info.scale);
        return object;
    },
    createBackground: function () {
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
    createStaticObject: function (textures, info) {
        var textureIndex = 0;
        if (info.texture)
            textureIndex = info.texture;
        return new GameObject(textures, textureIndex);
    }
};