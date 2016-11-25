import { View, Input, Output } from "./View";

export class Prompt extends View {

  public question: string
  public validRegexp = /^[a-zA-Z\s]+$/

  private _then: View
  public then(view: View): Prompt {
    this._then = view
    return this
  }

  private _inputValid: (input:string) => void
  public inputValid(callback: (input:string) => void): Prompt {
    this._inputValid = callback
    return this
  }


  onInput = (rawData: any) => {
    let data = rawData.toString().trim()
    if (this.validRegexp.test(data)) {
      this._inputValid(data)
      if (this._then) {
        this.transition(this._then)
      } else {
        this.back()
      }
    } else {
      this.render()
    }
  }

  run() {
    super.run()
    this.registerInput()
    this.render()
  }

  render() {
    super.render()
    process.stdout.write('\n')
    process.stdout.write(this.title+'\n')
    process.stdout.write(this.question+'\n')
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