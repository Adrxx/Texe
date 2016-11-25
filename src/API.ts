var request = require('request');
const api = "http://localhost:3000/battletext"

var j = request.jar();
var request = request.defaults({jar:j})
export class API {

  static getAllGames(callback: (list: {id:string,nombre:string}[], error: any) => void) {
    request.get({url:api + '/juegos_existentes/'}, function (error: any, response: any, body: any) {
      if (!error && response.statusCode == 200) {
        let json = JSON.parse(response.body)
        callback(json,null)
      } else {
        callback([],error)
      }
    })
  }

  static createNewGame(name: string, barcos:{}, callback: (creado: boolean, codigo: string, error: any) => void)  {
    request.post({url: api + '/crear_juego/', form: {nombre: name, barcos: JSON.stringify(barcos)}}, function (error: any, response: any, body: any) {
      if (!error && response.statusCode == 200) {
        let json = JSON.parse(response.body)
        callback(json.creado ,json.codigo ,null)
      } else {
        callback(false,"Error de conexión",error)
      }
    })
  }

  static joinGame(id: string, barcos:{}, callback: (creado: boolean, codigo: string, error: any) => void)  {
    request.put({url: api + '/unir_juego/', form: {id_juego: id, barcos: JSON.stringify(barcos)}}, function (error: any, response: any, body: any) {
      if (!error && response.statusCode == 200) {
        let json = JSON.parse(response.body)
        callback(json.unido,json.codigo ,null)
      } else {
        callback(false,"Error de conexión",error)
      }
    })
  }

  static fire(casilla: string, callback: (resultado: string, error: any) => void) {
    request.put({url: api + '/tirar/', form: { casilla: casilla }}, function (error: any, response: any, body: any) {
      if (!error && response.statusCode == 200) {
        let json = JSON.parse(response.body)
        callback(json.resultado, null)
      } else {
        callback("",error)
      }
    })
  }

    static state(callback: (resultado: any, error: any) => void) {
    request.get({url: api + '/estado/'}, function (error: any, response: any, body: any) {
      if (!error && response.statusCode == 200) {
        let json = JSON.parse(response.body)
        callback(json, null)
      } else {
        callback("",error)
      }
    })
  }

}
