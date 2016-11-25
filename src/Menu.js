"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View_1 = require("./View");
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        var _this = this;
        _super.apply(this, arguments);
        this._options = [];
        this.canReturn = true;
        this.backOption = "<--";
        this.exitOption = "SALIR";
        this.invalidOption = "Opción no valida";
        this.offset = 1;
        this.onInput = function (rawData) {
            var data = parseInt(rawData.toString().trim());
            if (data >= _this.offset && data < (_this._options.length + _this.offset)) {
                var nextPromptable = _this._options[data - _this.offset];
                _this.transition(nextPromptable);
            }
            else if (_this.canReturn && (data === (_this._options.length + _this.offset))) {
                _this.back();
            }
            else {
                _this.render();
            }
        };
    }
    Menu.prototype.options = function (options) {
        this._options = options;
        return this;
    };
    Menu.prototype.run = function () {
        _super.prototype.run.call(this);
        this.registerInput();
        this.render();
    };
    Menu.prototype.render = function () {
        _super.prototype.render.call(this);
        process.stdout.write(this.title + '\n');
        process.stdout.write('\n');
        process.stdout.write(this.description + '\n');
        for (var i in this._options) {
            process.stdout.write("[" + (parseInt(i) + this.offset) + "]-> " + this._options[i].title + "\n");
        }
        if (this.canReturn) {
            var message = this.parent ? this.backOption : this.exitOption;
            process.stdout.write("[" + (this._options.length + this.offset) + "] " + message + " \n");
        }
    };
    Menu.prototype.registerInput = function () {
        process.stdin.on('data', this.onInput);
    };
    Menu.prototype.unregisterInput = function () {
        process.stdin.removeListener('data', this.onInput);
    };
    Menu.prototype.transition = function (to) {
        this.unregisterInput();
        _super.prototype.transition.call(this, to);
    };
    Menu.prototype.back = function () {
        this.unregisterInput();
        _super.prototype.back.call(this);
    };
    return Menu;
}(View_1.View));
exports.Menu = Menu;
