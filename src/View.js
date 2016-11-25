"use strict";
var View = (function () {
    function View() {
        this.renderQueue = [];
    }
    View.prototype.run = function () {
        this.willStart();
        this.start();
        this.didStart();
    };
    View.prototype.render = function () {
        process.stdout.write('\u001B[2J\u001B[0;0f');
        for (var _i = 0, _a = this.renderQueue; _i < _a.length; _i++) {
            var item = _a[_i];
            item.render();
        }
    };
    View.prototype.willStart = function () { };
    View.prototype.start = function () { };
    View.prototype.didStart = function () { };
    View.prototype.transition = function (to) {
        to.parent = this;
        to.run();
    };
    View.prototype.back = function () {
        if (this.parent) {
            this.parent.run();
        }
        else {
            process.exit(0);
        }
    };
    return View;
}());
exports.View = View;
