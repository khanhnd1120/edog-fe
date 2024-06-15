import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CatchedEgonNews")
export class CatchedEgonNews extends Component {
  @property({ type: Label })
  labelAmount: Label;

  init(amount: number) {
    this.labelAmount.string = `${amount}`;
  }
}
