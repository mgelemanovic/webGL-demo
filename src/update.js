var lastTime = 0;

function update() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        player.move(elapsed);
    }
    lastTime = timeNow;
}