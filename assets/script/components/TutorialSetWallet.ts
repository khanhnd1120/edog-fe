import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TutorialSetWallet")
export class TutorialSetWallet extends Component {
  start() {}

  onCLickTurnOffTut() {
    this.node.active = false;
  }
}
