"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View_1 = require("./View");
var Prompt = (function (_super) {
    __extends(Prompt, _super);
    function Prompt() {
        var _this = this;
        _super.apply(this, arguments);
        this.validRegexp = /^[a-zA-Z\s]+$/;
        this.onInput = function (rawData) {
            var data = rawData.toString().trim();
            if (_this.validRegexp.test(data)) {
                _this._inputValid(data);
                if (_this._then) {
                    _this.transition(_this._then);
                }
                else {
                    _this.back();
                }
            }
            else {
                _this.render();
            }
        };
    }
    Prompt.prototype.then = function (view) {
        this._then = view;
        return this;
    };
    Prompt.prototype.inputValid = function (callback) {
        this._inputValid = callback;
        return this;
    };
    Prompt.prototype.run = function () {
        _super.prototype.run.call(this);
        this.registerInput();
        this.render();
    };
    Prompt.prototype.render = function () {
        _super.prototype.render.call(this);
        process.stdout.write('\n');
        process.stdout.write(this.title + '\n');
        process.stdout.write(this.question + '\n');
    };
    Prompt.prototype.registerInput = function () {
        process.stdin.on('data', this.onInput);
    };
    Prompt.prototype.unregisterInput = function () {
        process.stdin.removeListener('data', this.onInput);
    };
    Prompt.prototype.transition = function (to) {
        this.unregisterInput();
        _super.prototype.transition.call(this, to);
    };
    Prompt.prototype.back = function () {
        this.unregisterInput();
        _super.prototype.back.call(this);
    };
    return Prompt;
}(View_1.View));
exports.Prompt = Prompt;
