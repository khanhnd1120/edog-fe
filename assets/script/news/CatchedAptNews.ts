import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CatchedAptNews")
export class CatchedAptNews extends Component {
  @property({ type: Label })
  labelAmount: Label;

  init(amount: number) {
    this.labelAmount.string = `${amount}`;
  }
}
