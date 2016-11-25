export interface Input {
  registerInput(): void
  onInput: ((rawData: any) => void)
  unregisterInput(): void
}

export interface Output {
  render(): void
}

//Handles only navigation
export class View implements Output {

  public title: string
  public renderQueue: Output[] = []
  parent?: View

  run() {
    this.willStart()
    this.start()
    this.didStart()
  }

  render() {
    process.stdout.write('\u001B[2J\u001B[0;0f') //Clear screen
    for (var item of this.renderQueue) {
      item.render()
    }
  }
  //Lifecycle
  willStart() {}
  start() {}
  didStart() {}

  transition(to: View) {
    to.parent = this
    to.run()
  }

  back() {
    if (this.parent) {
      this.parent.run()
    } else {
      process.exit(0)
    }
  }

}