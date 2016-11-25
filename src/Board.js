"use strict";
var Barquito = (function () {
    function Barquito(formato, tamano) {
        this.derecha = (formato[0].toUpperCase() !== "H");
        this.fila = formato[1].toUpperCase();
        this.columna = formato.substring(2);
        this.tamano = tamano;
    }
    Barquito.prototype.formato = function () {
        return "" + (this.derecha ? "V" : "H") + this.fila + this.columna;
    };
    Barquito.prototype.coordenadas = function () {
        var letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        var numeros = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        var casillas = [];
        var inicioFila = letras.indexOf(this.fila);
        var inicioColumna = parseInt(this.columna) - 1;
        var cambiante;
        var inicio;
        if (this.derecha) {
            cambiante = letras;
            inicio = inicioFila;
        }
        else {
            cambiante = numeros;
            inicio = inicioColumna;
        }
        if ((inicio + this.tamano) > 10) {
            return [];
        }
        for (var i = inicio; i < inicio + this.tamano; i++) {
            if (this.derecha) {
                casillas.push(cambiante[i] + numeros[inicioColumna]);
            }
            else {
                casillas.push(letras[inicioFila] + cambiante[i]);
            }
        }
        return casillas;
    };
    return Barquito;
}());
exports.Barquito = Barquito;
(function (TipoBarquito) {
    TipoBarquito[TipoBarquito["b5"] = 0] = "b5";
    TipoBarquito[TipoBarquito["b4"] = 1] = "b4";
    TipoBarquito[TipoBarquito["b3a"] = 2] = "b3a";
    TipoBarquito[TipoBarquito["b3b"] = 3] = "b3b";
    TipoBarquito[TipoBarquito["b2"] = 4] = "b2";
})(exports.TipoBarquito || (exports.TipoBarquito = {}));
var TipoBarquito = exports.TipoBarquito;
var Board = (function () {
    function Board() {
        this.marcadosFallados = [];
        this.marcadosAtinados = [];
        this.realAtinados = [];
        this.realFallados = [];
        this.messages = [];
    }
    Board.prototype.barcosAPI = function () {
        return { b5: this.b5.formato(), b4: this.b4.formato(), b3a: this.b3a.formato(), b3b: this.b3b.formato(), b2: this.b2.formato() };
    };
    Board.prototype.exportBoard = function () {
        return;
    };
    Board.prototype.validate = function () {
        return { ok: true, reason: "" };
    };
    Board.prototype.render = function () {
        for (var _i = 0, _a = this.messages; _i < _a.length; _i++) {
            var item = _a[_i];
            item.render();
        }
        function marcarCoordenadas(coordenadas, simbolo, grd) {
            for (var _i = 0, coordenadas_1 = coordenadas; _i < coordenadas_1.length; _i++) {
                var c = coordenadas_1[_i];
                c = c.trim().toUpperCase();
                var letra = c.substring(-1, 1).toLowerCase();
                var coordenada = parseInt(c.substring(1));
                var superIndexes = { 'a': 0, 'b': 1, 'c': 2, "d": 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7,
                    'i': 8, 'j': 9 };
                var line = grd[superIndexes[letra]].split(' ');
                line[coordenada] = simbolo;
                grd[superIndexes[letra]] = line.join(' ');
            }
        }
        var grid = [
            'A 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹',
            'B 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹',
            'C 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹',
            'D 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹',
            'E 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹',
            'F 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹',
            'G 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹',
            'H 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹',
            'I 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹',
            'J 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹 🔹',
            '  1 2 3 4 5 6 7 8 9 10'];
        if (this.b5) {
            marcarCoordenadas(this.b5.coordenadas(), "♓", grid);
        }
        if (this.b4) {
            marcarCoordenadas(this.b4.coordenadas(), "♊", grid);
        }
        if (this.b3a) {
            marcarCoordenadas(this.b3a.coordenadas(), "♌", grid);
        }
        if (this.b3b) {
            marcarCoordenadas(this.b3b.coordenadas(), "♎", grid);
        }
        if (this.b2) {
            marcarCoordenadas(this.b2.coordenadas(), "♐", grid);
        }
        marcarCoordenadas(this.marcadosFallados, "🔴", grid);
        marcarCoordenadas(this.marcadosAtinados, "🔵", grid);
        marcarCoordenadas(this.realAtinados, "💥", grid);
        marcarCoordenadas(this.realFallados, "🌀", grid);
        process.stdout.write(grid.join('\n'));
        process.stdout.write("\n==========================\n");
    };
    return Board;
}());
exports.Board = Board;
