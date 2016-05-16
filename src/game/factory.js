var Creator = {};

var Factory = function (tag, info) {
    if (!(tag in Creator)) tag = "GameObject";
    var object = Creator[tag].create(info);
    object.position.setv(info.pos);
    Creator[tag].pool().push(object);
};