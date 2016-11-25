"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View_1 = require("./View");
var Process = (function (_super) {
    __extends(Process, _super);
    function Process() {
        _super.apply(this, arguments);
        this.description = "";
    }
    Process.prototype.then = function (view) {
        this._then = view;
        return this;
    };
    Process.prototype.action = function (callback) {
        this._action = callback;
        return this;
    };
    Process.prototype.done = function () {
        this.transition(this._then);
    };
    Process.prototype.fail = function () {
        this.back();
    };
    Process.prototype.run = function () {
        _super.prototype.run.call(this);
        this.render();
        this._action();
    };
    Process.prototype.render = function () {
        _super.prototype.render.call(this);
        process.stdout.write(this.description + '\n');
    };
    Process.prototype.transition = function (to) {
        to.parent = this.parent;
        to.run();
    };
    return Process;
}(View_1.View));
exports.Process = Process;
