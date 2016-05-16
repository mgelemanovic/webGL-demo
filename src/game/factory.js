var Creator = {};

var Factory = function (tag, info) {
    if (!(tag in Creator)) tag = "GameObject";
    var object = Creator[tag].create(info);
    object.position.setv(info.pos);
    if (info.scale)
        object.scale.setv(info.scale);
    Creator[tag].pool().push(object);
};