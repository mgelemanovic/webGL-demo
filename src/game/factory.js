var creator = {};

Factory = {
    create: function (tag, info) {
        if (!(tag in creator)) tag = "GameObject";
        var object = creator[tag].create(info);
        object.position.setv(info.pos);
        if (info.scale)
            object.scale.setv(info.scale);
        return object;
    },
    createBackground: function () {
        var bg = new GameObject(game.textureManager.background, 0);
        bg.drawDistance = -0.5;
        bg.scale.x = 1.19;
        return bg;
    }
};