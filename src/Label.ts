import { Output } from "./View";

export class Label implements Output {

  constructor(public text: string) {}

  render() {
    process.stdout.write(`\n========== ${this.text} ===========\n`)
  }
}