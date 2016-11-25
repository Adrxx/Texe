import { Board, TipoBarquito, Barquito } from "./Board";
import { API } from "./API";
import { Menu } from "./Menu";
import { Label } from "./Label";
import { Process } from "./Process";
import { Prompt } from "./Prompt";

enum State {
  menu, settingBoard, playing ,waiting, gameover
}

let cookies = ""
const PAUSA       = 1000; // Milisegundos entre cada petición de espera
let juegoActual =  {id:"", nombre:""}
let casillaATirar = ""
let listaDeJuegos: {id:string,nombre:string}[] = []
let state: State
const board: Board = new Board()
board.b5 = new Barquito("ha1",5)
board.b4 = new Barquito("hc1",4)
board.b3a  = new Barquito("he1",3)
board.b3b  = new Barquito("hf1",3)
board.b2 = new Barquito("hg1",2)

const boardMarcas: Board = new Board()

//Menus
const barquito = '                                )___(\n'+
'                         _______/__/_\n'+
'                ___     /===========|   ___\n'+
'____       __   [\\\\\\]___/____________|__[///]   __\n'+
'\\   \\_____[\\\\]__/___________________________\\__[//]___\n'+
' \\'+'40A                                                 |\n'+
'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'
let menu = new Menu()
menu.title = barquito + "BattleText"
menu.description = "Bonito Juegito :D"


let menuUnirseAJuego = new Menu()
menuUnirseAJuego.title = "Unirse a un Juego"
menuUnirseAJuego.description = "jsdkajshd"


function menuPrepararJuego(juego: {id:string,nombre:string}, create: boolean): Menu {
  let menuPrepararJuego = new Menu()
  menuPrepararJuego.title = juego.nombre
  menuPrepararJuego.canReturn = true
  menuPrepararJuego.renderQueue = [board]
  menuPrepararJuego.description = "Tienes bla bla barcos para bla bla..."

  let last = create ? processCrearJuego : processUnirseAJuego(juego.id)
  menuPrepararJuego.options([
    promptColocaBarquito(TipoBarquito.b5),
    promptColocaBarquito(TipoBarquito.b4),
    promptColocaBarquito(TipoBarquito.b3a),
    promptColocaBarquito(TipoBarquito.b3b),
    promptColocaBarquito(TipoBarquito.b2),
    last
    ])
  return menuPrepararJuego
}


let promptCrearJuego = new Prompt()
promptCrearJuego.title = "Crear Nuevo Juego"
promptCrearJuego.question = "Escriba el nombre del juego (Solo letras y espacios)"
promptCrearJuego.inputValid( (input:string) => {
  juegoActual.nombre = input
  board.messages = [new Label(input)]
})

function promptColocaBarquito(tipo: TipoBarquito): Prompt {
  let prompt = new Prompt()
  prompt.renderQueue = [board]
  prompt.title = "Barco: " + TipoBarquito[tipo]

  prompt.question = "Escribe bla bla instrucciones"
  prompt.validRegexp = /^[HVhv]{1}[ABCDEFGHIJabcdefghij]{1}[\d]{1,2}$/
  prompt.inputValid( (input:string) => {
    switch (tipo) {
    case TipoBarquito.b5:
      board.b5 = new Barquito(input,5)
      break;
    case TipoBarquito.b4:
      board.b4 = new Barquito(input,4)
      break;
    case TipoBarquito.b3a:
      board.b3a = new Barquito(input,3)
      break;
    case TipoBarquito.b3b:
      board.b3b = new Barquito(input,3)
      break;
    case TipoBarquito.b2:
      board.b2 = new Barquito(input,2)
      break;
    }
  })
  return prompt
}

function processUnirseAJuego(id:string): Process {
  let processUnirseAJuego = new Process()
  processUnirseAJuego.title = "Empezar juego..."
  processUnirseAJuego.description = "Uniendose a juego..."
  processUnirseAJuego.then(processEsperar)
  processUnirseAJuego.action(() => {
    API.joinGame(id,board.barcosAPI(), (creado, codigo, error) => {
      //console.log("SDSA")
     if (creado) {
       processUnirseAJuego.done()
     } else {
       processUnirseAJuego.parent.renderQueue = [board,new Label("ERROR AL UNIRSE: " + codigo)]
       processUnirseAJuego.fail()
     }
    })

  })
  return processUnirseAJuego
}


let processGetJuegos = new Process()
processGetJuegos.title = "Unirse a un juego"
processGetJuegos.description = "Descargando lista de juegos..."
processGetJuegos.action(() => {
   API.getAllGames( (list, error) => {
     if (error) {
       menu.renderQueue = [new Label("ERROR AL DESCARGAR JUEGOS")]
       processGetJuegos.fail()
     } else {
       menuUnirseAJuego.options([])
       listaDeJuegos = list
       let options = list.map(x => menuPrepararJuego(x,false))
       menuUnirseAJuego.options(options)
       processGetJuegos.done()
     }
   })
 })

let processEsperar = new Process()
processEsperar.title = "Esperar "
processEsperar.description = "Esperando..."
processEsperar.renderQueue = [board,boardMarcas]
let refresh = function refresh() {
  setTimeout(() => {
    API.state((respuesta,error) => {
      //console.log(respuesta)
      board.realFallados = respuesta.oponenteFallados
      board.realAtinados = respuesta.oponenteAtinados
      //console.log(respuesta)
      switch (respuesta.estado) {
        case "ganaste":
          // code...
            console.log("GANASTE!")
            process.exit(0)
          break;
        case "perdiste":
          // code...
            console.log("PERDISTE!")
            process.exit(0)
          break;
        case "tu_turno":

          processEsperar.then(promptJuego)
          processEsperar.done()
          break;
        default: //espera
          //processEsperar.render()
          refresh()
          break;
      }
    })
    }, PAUSA);
}
processEsperar.action(() => {
  refresh()
 })

let processTirar = new Process()
processTirar.title = "Tirar"
processTirar.description = "Haciendo tiro..."
processTirar.then(processEsperar)
processTirar.action(() => {
    API.fire(casillaATirar, (resultado,error) => {
      switch (resultado) {
        case "agua":
          boardMarcas.marcadosFallados.push(casillaATirar)
          processTirar.done()
          break;
        case "tocado":
          processTirar.renderQueue = [new Label(casillaATirar + " TOCADO")]
          boardMarcas.marcadosAtinados.push(casillaATirar)
          processTirar.back()
          break;
        case "hundido":
          processTirar.renderQueue = [new Label(casillaATirar + "HUNDIDO")]
          boardMarcas.marcadosAtinados.push(casillaATirar)
          processTirar.back()
          break;
        default:
          // code...
          break;
      }
    })
 })

let promptJuego = new Prompt()
promptJuego.title = "Empezar Juego"
promptJuego.renderQueue = [board,boardMarcas]
promptJuego.question = "Haz tu disparo..."
promptJuego.validRegexp = /^[ABCDEFGHIJabcdefghij]{1}[\d]{1,2}$/
promptJuego.then(processTirar)
promptJuego.inputValid((input) => {
  casillaATirar = input
})

let processCrearJuego = new Process()
processCrearJuego.title = "Empezar juego..."
processCrearJuego.description = "Creando juego..."
processCrearJuego.then(processEsperar)
processCrearJuego.action(() => {
  let validate = board.validate()
  if (validate.ok) {
    API.createNewGame(juegoActual.nombre, board.barcosAPI(), (creado, codigo, error) => {
     if (creado) {
       processCrearJuego.done()
     } else {
       processCrearJuego.parent.renderQueue = [board,new Label("ERROR AL CREAR: " + codigo)]
       processCrearJuego.fail()
     }
   })
  }
})


menu.options([
  promptCrearJuego.then(menuPrepararJuego(juegoActual,true)),
  processGetJuegos.then(menuUnirseAJuego)
  ]).run()
