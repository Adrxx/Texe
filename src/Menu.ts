import { View, Input, Output } from "./View";

export class Menu extends View implements Input {

  public description: string

  private _options: View[] = []
  public canReturn = true
  public backOption = "<--"
  public exitOption = "SALIR"
  public invalidOption = "Opción no valida"

  private offset = 1 //Starting option offset if == 1 the options start at [1]...[2] etc

  onInput = (rawData: any) => {
    let data = parseInt(rawData.toString().trim())
    // Options
    if (data >= this.offset && data < (this._options.length + this.offset)) {
      let nextPromptable = this._options[data-this.offset]
      this.transition(nextPromptable)
    } else if (this.canReturn && (data === (this._options.length + this.offset))) {
      // Back button if enabled... Back is the last option
      this.back()
    } else {
      this.render()
    }
  }

  public options(options: View[]): Menu {
    this._options = options
    return this
  }

  run() {
    super.run()
    this.registerInput()
    this.render()
  }

  render() {
    super.render()
    //process.stdout.write(Array.prototype.map.call(this.title, () => '*'))
    process.stdout.write(this.title+'\n')
    //process.stdout.write(Array.prototype.map.call(this.title, () => '*'))
    process.stdout.write('\n')
    process.stdout.write(this.description+'\n')
    for (var i in this._options) {
      process.stdout.write(`[${parseInt(i)+this.offset}]-> ${this._options[i].title}\n`)
    }
    if (this.canReturn) {
      let message = this.parent ? this.backOption : this.exitOption
      process.stdout.write(`[${this._options.length + this.offset}] ${message} \n`)
    }
  }

  registerInput() {
    process.stdin.on('data', this.onInput);
  }
  unregisterInput() {
    process.stdin.removeListener('data',this.onInput)
  }

  transition(to: View) {
    this.unregisterInput()
    super.transition(to)
  }

  back() {
    this.unregisterInput()
    super.back()
  }

}