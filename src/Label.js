"use strict";
var Label = (function () {
    function Label(text) {
        this.text = text;
    }
    Label.prototype.render = function () {
        process.stdout.write("\n========== " + this.text + " ===========\n");
    };
    return Label;
}());
exports.Label = Label;
