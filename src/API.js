"use strict";
var request = require('request');
var api = "http://localhost:3000/battletext";
var j = request.jar();
var request = request.defaults({ jar: j });
var API = (function () {
    function API() {
    }
    API.getAllGames = function (callback) {
        request.get({ url: api + '/juegos_existentes/' }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(response.body);
                callback(json, null);
            }
            else {
                callback([], error);
            }
        });
    };
    API.createNewGame = function (name, barcos, callback) {
        request.post({ url: api + '/crear_juego/', form: { nombre: name, barcos: JSON.stringify(barcos) } }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(response.body);
                callback(json.creado, json.codigo, null);
            }
            else {
                callback(false, "Error de conexión", error);
            }
        });
    };
    API.joinGame = function (id, barcos, callback) {
        request.put({ url: api + '/unir_juego/', form: { id_juego: id, barcos: JSON.stringify(barcos) } }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(response.body);
                callback(json.unido, json.codigo, null);
            }
            else {
                callback(false, "Error de conexión", error);
            }
        });
    };
    API.fire = function (casilla, callback) {
        request.put({ url: api + '/tirar/', form: { casilla: casilla } }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(response.body);
                callback(json.resultado, null);
            }
            else {
                callback("", error);
            }
        });
    };
    API.state = function (callback) {
        request.get({ url: api + '/estado/' }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(response.body);
                callback(json, null);
            }
            else {
                callback("", error);
            }
        });
    };
    return API;
}());
exports.API = API;
