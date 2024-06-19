import { _decorator, Component, Label, Node } from "cc";
import { G } from "../G";
import { DialogType } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("DialogClaimQuest")
export class DialogClaimQuest extends Component {
  @property({ type: Label })
  aptLabel: Label;

  init(val: number) {
    this.aptLabel.string = `${val}`;
  }

  onBtnClaimClick() {
    G.gameRoot.hideDialog(DialogType.ClaimQuest);
  }
}
