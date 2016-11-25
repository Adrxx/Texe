"use strict";
var Board_1 = require("./Board");
var API_1 = require("./API");
var Menu_1 = require("./Menu");
var Label_1 = require("./Label");
var Process_1 = require("./Process");
var Prompt_1 = require("./Prompt");
var State;
(function (State) {
    State[State["menu"] = 0] = "menu";
    State[State["settingBoard"] = 1] = "settingBoard";
    State[State["playing"] = 2] = "playing";
    State[State["waiting"] = 3] = "waiting";
    State[State["gameover"] = 4] = "gameover";
})(State || (State = {}));
var cookies = "";
var PAUSA = 1000;
var juegoActual = { id: "", nombre: "" };
var casillaATirar = "";
var listaDeJuegos = [];
var state;
var board = new Board_1.Board();
board.b5 = new Board_1.Barquito("ha1", 5);
board.b4 = new Board_1.Barquito("hc1", 4);
board.b3a = new Board_1.Barquito("he1", 3);
board.b3b = new Board_1.Barquito("hf1", 3);
board.b2 = new Board_1.Barquito("hg1", 2);
var boardMarcas = new Board_1.Board();
var barquito = '                                )___(\n' +
    '                         _______/__/_\n' +
    '                ___     /===========|   ___\n' +
    '____       __   [\\\\\\]___/____________|__[///]   __\n' +
    '\\   \\_____[\\\\]__/___________________________\\__[//]___\n' +
    ' \\' + '40A                                                 |\n' +
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n';
var menu = new Menu_1.Menu();
menu.title = barquito + "BattleText";
menu.description = "Bonito Juegito :D";
var menuUnirseAJuego = new Menu_1.Menu();
menuUnirseAJuego.title = "Unirse a un Juego";
menuUnirseAJuego.description = "jsdkajshd";
function menuPrepararJuego(juego, create) {
    var menuPrepararJuego = new Menu_1.Menu();
    menuPrepararJuego.title = juego.nombre;
    menuPrepararJuego.canReturn = true;
    menuPrepararJuego.renderQueue = [board];
    menuPrepararJuego.description = "Tienes bla bla barcos para bla bla...";
    var last = create ? processCrearJuego : processUnirseAJuego(juego.id);
    menuPrepararJuego.options([
        promptColocaBarquito(Board_1.TipoBarquito.b5),
        promptColocaBarquito(Board_1.TipoBarquito.b4),
        promptColocaBarquito(Board_1.TipoBarquito.b3a),
        promptColocaBarquito(Board_1.TipoBarquito.b3b),
        promptColocaBarquito(Board_1.TipoBarquito.b2),
        last
    ]);
    return menuPrepararJuego;
}
var promptCrearJuego = new Prompt_1.Prompt();
promptCrearJuego.title = "Crear Nuevo Juego";
promptCrearJuego.question = "Escriba el nombre del juego (Solo letras y espacios)";
promptCrearJuego.inputValid(function (input) {
    juegoActual.nombre = input;
    board.messages = [new Label_1.Label(input)];
});
function promptColocaBarquito(tipo) {
    var prompt = new Prompt_1.Prompt();
    prompt.renderQueue = [board];
    prompt.title = "Barco: " + Board_1.TipoBarquito[tipo];
    prompt.question = "Escribe bla bla instrucciones";
    prompt.validRegexp = /^[HVhv]{1}[ABCDEFGHIJabcdefghij]{1}[\d]{1,2}$/;
    prompt.inputValid(function (input) {
        switch (tipo) {
            case Board_1.TipoBarquito.b5:
                board.b5 = new Board_1.Barquito(input, 5);
                break;
            case Board_1.TipoBarquito.b4:
                board.b4 = new Board_1.Barquito(input, 4);
                break;
            case Board_1.TipoBarquito.b3a:
                board.b3a = new Board_1.Barquito(input, 3);
                break;
            case Board_1.TipoBarquito.b3b:
                board.b3b = new Board_1.Barquito(input, 3);
                break;
            case Board_1.TipoBarquito.b2:
                board.b2 = new Board_1.Barquito(input, 2);
                break;
        }
    });
    return prompt;
}
function processUnirseAJuego(id) {
    var processUnirseAJuego = new Process_1.Process();
    processUnirseAJuego.title = "Empezar juego...";
    processUnirseAJuego.description = "Uniendose a juego...";
    processUnirseAJuego.then(processEsperar);
    processUnirseAJuego.action(function () {
        API_1.API.joinGame(id, board.barcosAPI(), function (creado, codigo, error) {
            if (creado) {
                processUnirseAJuego.done();
            }
            else {
                processUnirseAJuego.parent.renderQueue = [board, new Label_1.Label("ERROR AL UNIRSE: " + codigo)];
                processUnirseAJuego.fail();
            }
        });
    });
    return processUnirseAJuego;
}
var processGetJuegos = new Process_1.Process();
processGetJuegos.title = "Unirse a un juego";
processGetJuegos.description = "Descargando lista de juegos...";
processGetJuegos.action(function () {
    API_1.API.getAllGames(function (list, error) {
        if (error) {
            menu.renderQueue = [new Label_1.Label("ERROR AL DESCARGAR JUEGOS")];
            processGetJuegos.fail();
        }
        else {
            menuUnirseAJuego.options([]);
            listaDeJuegos = list;
            var options = list.map(function (x) { return menuPrepararJuego(x, false); });
            menuUnirseAJuego.options(options);
            processGetJuegos.done();
        }
    });
});
var processEsperar = new Process_1.Process();
processEsperar.title = "Esperar ";
processEsperar.description = "Esperando...";
processEsperar.renderQueue = [board, boardMarcas];
var refresh = function refresh() {
    setTimeout(function () {
        API_1.API.state(function (respuesta, error) {
            board.realFallados = respuesta.oponenteFallados;
            board.realAtinados = respuesta.oponenteAtinados;
            switch (respuesta.estado) {
                case "ganaste":
                    console.log("GANASTE!");
                    process.exit(0);
                    break;
                case "perdiste":
                    console.log("PERDISTE!");
                    process.exit(0);
                    break;
                case "tu_turno":
                    processEsperar.then(promptJuego);
                    processEsperar.done();
                    break;
                default:
                    refresh();
                    break;
            }
        });
    }, PAUSA);
};
processEsperar.action(function () {
    refresh();
});
var processTirar = new Process_1.Process();
processTirar.title = "Tirar";
processTirar.description = "Haciendo tiro...";
processTirar.then(processEsperar);
processTirar.action(function () {
    API_1.API.fire(casillaATirar, function (resultado, error) {
        switch (resultado) {
            case "agua":
                boardMarcas.marcadosFallados.push(casillaATirar);
                processTirar.done();
                break;
            case "tocado":
                processTirar.renderQueue = [new Label_1.Label(casillaATirar + " TOCADO")];
                boardMarcas.marcadosAtinados.push(casillaATirar);
                processTirar.back();
                break;
            case "hundido":
                processTirar.renderQueue = [new Label_1.Label(casillaATirar + "HUNDIDO")];
                boardMarcas.marcadosAtinados.push(casillaATirar);
                processTirar.back();
                break;
            default:
                break;
        }
    });
});
var promptJuego = new Prompt_1.Prompt();
promptJuego.title = "Empezar Juego";
promptJuego.renderQueue = [board, boardMarcas];
promptJuego.question = "Haz tu disparo...";
promptJuego.validRegexp = /^[ABCDEFGHIJabcdefghij]{1}[\d]{1,2}$/;
promptJuego.then(processTirar);
promptJuego.inputValid(function (input) {
    casillaATirar = input;
});
var processCrearJuego = new Process_1.Process();
processCrearJuego.title = "Empezar juego...";
processCrearJuego.description = "Creando juego...";
processCrearJuego.then(processEsperar);
processCrearJuego.action(function () {
    var validate = board.validate();
    if (validate.ok) {
        API_1.API.createNewGame(juegoActual.nombre, board.barcosAPI(), function (creado, codigo, error) {
            if (creado) {
                processCrearJuego.done();
            }
            else {
                processCrearJuego.parent.renderQueue = [board, new Label_1.Label("ERROR AL CREAR: " + codigo)];
                processCrearJuego.fail();
            }
        });
    }
});
menu.options([
    promptCrearJuego.then(menuPrepararJuego(juegoActual, true)),
    processGetJuegos.then(menuUnirseAJuego)
]).run();
