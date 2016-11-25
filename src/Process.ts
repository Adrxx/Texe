import { View } from "./View";

export class Process extends View {

  public description: string = ""


  private _then: View
  public then(view: View): Process {
    this._then = view
    return this
  }

  private _action: () => void
  public action(callback: () => void): Process {
    this._action = callback
    return this
  }

  public done() {
    this.transition(this._then)
  }

  public fail() {
    this.back()
  }

  run() {
    super.run()
    this.render()
    this._action()
  }

  render() {
    super.render()
    process.stdout.write(this.description+'\n')
  }

  transition(to: View) {
    // So going back skips the process and goes to the view beofre the process
    to.parent = this.parent
    to.run()
  }

}