var Creator = {};

var Factory = function (info) {
    var tag = info.tag;
    if (!(tag in Creator)) tag = "GameObject";
    var object = Creator[tag].create(info);
    object.position.setv(info.pos);
    Creator[tag].pool().push(object);
};