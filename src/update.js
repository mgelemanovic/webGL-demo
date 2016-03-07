var lastTime = 0;

var gAcc = -0.000001;

function update() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        player.speed += gAcc * elapsed;
        player.y += player.speed * elapsed;
    }
    lastTime = timeNow;
}