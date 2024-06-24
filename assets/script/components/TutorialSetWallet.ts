import { _decorator, Component, director, Node } from "cc";
import { G } from "../G";
const { ccclass, property } = _decorator;

@ccclass("TutorialSetWallet")
export class TutorialSetWallet extends Component {
  start() {}

  onCLickTurnOffTut() {
    director.loadScene("userinfo");
    this.node.active = false;
  }
}
