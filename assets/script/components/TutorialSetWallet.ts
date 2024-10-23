import { _decorator, Component, director, Node } from "cc";
import { G } from "../G";
import { DialogType } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("TutorialSetWallet")
export class TutorialSetWallet extends Component {
  start() {}

  onCLickTurnOffTut() {
    G.gameRoot.showDialog(DialogType.SetWallet);
    this.node.active = false;
  }
}
