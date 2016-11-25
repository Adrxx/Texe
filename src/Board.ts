import { Output } from "./View";

export class Barquito {
  fila: string
  columna: string
  tamano: number
  derecha: boolean

  constructor(formato: string, tamano: number) {
    this.derecha = (formato[0].toUpperCase() !== "H");
    this.fila = formato[1].toUpperCase();
    this.columna = formato.substring(2);
    this.tamano = tamano
  }

  formato(): string {
    return `${this.derecha ? "V": "H"}${this.fila}${this.columna}`
  }

  coordenadas(): string[] {
    let letras = ["A","B","C","D","E","F","G","H","I","J"];
    let numeros = ["1","2","3","4","5","6","7","8","9","10"];
    let casillas: string[] = [];
    let inicioFila = letras.indexOf(this.fila);
    let inicioColumna = parseInt(this.columna) - 1;
    let cambiante: string[]; // letras o numeros
    let inicio: number; // letras o numeros
    if (this.derecha) {
      cambiante = letras;
      inicio = inicioFila;
    } else {
      cambiante = numeros;
      inicio = inicioColumna;
    }
    // SI SE SALE DEL TABLERO NO ES VALIDO
    if ((inicio + this.tamano) > 10) {
      return [];
    }
    // GENERA LAS CASILLAS
    for (let i = inicio; i < inicio + this.tamano; i++) {
      if (this.derecha) {
        casillas.push(cambiante[i]+numeros[inicioColumna]);
      }
      else {
        casillas.push(letras[inicioFila]+cambiante[i]);
      }
    }
    return casillas;
  }
}

export enum TipoBarquito {
  b5, b4, b3a ,b3b, b2
}

export class Board implements Output {

  public b5: Barquito
  public b4: Barquito
  public b3a: Barquito
  public b3b: Barquito
  public b2: Barquito

  public marcadosFallados: string[] = []
  public marcadosAtinados: string[] = []
  public realAtinados: string[] = []
  public realFallados: string[] = []

  messages: Output[] = []

  barcosAPI(): {b5:string, b4:string, b3a:string, b3b:string, b2:string} {
    return {b5: this.b5.formato(), b4:this.b4.formato(), b3a:this.b3a.formato(), b3b:this.b3b.formato(), b2:this.b2.formato()}
  }

  exportBoard(): {} {
    return
  }

  validate(): { ok: boolean, reason:string} {
    return { ok: true, reason: "" }
  }

  render() {
    for (var item of this.messages) {
      item.render()
    }
    function marcarCoordenadas(coordenadas:string[],simbolo:string, grd: string[]){
      for (let c of coordenadas) {
        c=c.trim().toUpperCase()
        let letra=c.substring(-1,1).toLowerCase();
        let coordenada=parseInt(c.substring(1));

        let superIndexes: any = {'a':0, 'b':1, 'c':2, "d":3, 'e':4, 'f':5, 'g':6, 'h':7,
        'i':8, 'j':9};

        let line = grd[superIndexes[letra]].split(' ');
        line[coordenada]=simbolo;
        grd[superIndexes[letra]]=line.join(' ');
      }
    }
    let grid=[
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
    if (this.b5) { marcarCoordenadas(this.b5.coordenadas(),"♓",grid) }
    if (this.b4) { marcarCoordenadas(this.b4.coordenadas(),"♊",grid) }
    if (this.b3a) { marcarCoordenadas(this.b3a.coordenadas(),"♌",grid) }
    if (this.b3b) { marcarCoordenadas(this.b3b.coordenadas(),"♎",grid) }
    if (this.b2) { marcarCoordenadas(this.b2.coordenadas(),"♐",grid) }
    marcarCoordenadas(this.marcadosFallados,"🔴",grid)
    marcarCoordenadas(this.marcadosAtinados,"🔵",grid)
    marcarCoordenadas(this.realAtinados,"💥",grid)
    marcarCoordenadas(this.realFallados,"🌀",grid)
    process.stdout.write(grid.join('\n'))
    process.stdout.write("\n==========================\n")
  }
}