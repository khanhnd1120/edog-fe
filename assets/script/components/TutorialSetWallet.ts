import { _decorator, Component, Node } from "cc";
import { ColyseusManager } from "../../Libs/ColyseusManager";
const { ccclass, property } = _decorator;

@ccclass("TutorialSetWallet")
export class TutorialSetWallet extends Component {
  start() {}

  onCLickTurnOffTut() {
    ColyseusManager.Instance()
      .getServerObject()
      .send("on-tut", { isTut: false });
  }
}
