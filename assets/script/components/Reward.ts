import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Reward")
export class Reward extends Component {
  @property({ type: Label })
  labelTotal: Label;
  @property({ type: Label })
  labelBonus: Label;

  init({ total, bonus }: { total: number; bonus: number }) {
    this.labelTotal.string = `+${total}`;
    if (bonus) {
      this.labelBonus.string = `( +${bonus} bonus )`;
    } else {
      this.labelBonus.string = ``;
    }
  }

  onFinishAnim() {
    this.node.destroy();
  }
}
