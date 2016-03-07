var lastTime = 0;

var gAcc = -0.000001;

function update() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        player.speed.y += gAcc * elapsed;
        player.position.y += player.speed.y * elapsed;
        if (player.position.y < -1) {
            player.position.y = -1;
            player.speed.y = 0;
        }
    }
    lastTime = timeNow;
}