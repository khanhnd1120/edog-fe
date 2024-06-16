import { _decorator, Component, director, Node } from "cc";
import { G } from "../G";
import { GameRoot } from "../shared/GameRoot";
import { ColyseusManager } from "../../Libs/ColyseusManager";
import { DialogType } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("SceneLoading")
export class SceneLoading extends Component {
  @property(Node)
  gameRoot: Node = null;
  start() {
    if (G.gameRoot) {
      G.gameRoot.hideAllDialog();
      G.gameRoot.showDialog(DialogType.Instruct1);
      return;
    }
    director.addPersistRootNode(this.gameRoot);
    Promise.all([this.initGlobal(), this.waitLoadConfig()]).then(() => {
      G.gameRoot.showDialog(DialogType.Instruct1);
    });
  }
  async waitLoadConfig() {
    while (true) {
      if (ColyseusManager.Instance().checkIsLoadConfig()) {
        break;
      }
      await this.delay(1000);
    }
  }
  async initGlobal() {
    G.gameRoot = this.gameRoot.getComponent(GameRoot);
  }
  delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
