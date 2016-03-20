var mvMatrix = mat4.create();   // Model View Matrix
var mvMatrixStack = [];
var pMatrix = mat4.create();    // Perspective Matrix

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}