import { _decorator, Animation, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Reward")
export class Reward extends Component {
  @property({ type: Label })
  labelTotal: Label;
  @property({ type: Label })
  labelBonus: Label;

  init({
    total,
    bonus,
    playOnLoad = true,
  }: {
    total: number;
    bonus: number;
    playOnLoad?: boolean;
  }) {
    this.node.getComponent(Animation).playOnLoad = playOnLoad;
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
