import { _decorator, Component, director, Label, Node } from "cc";
import { G } from "../G";
import { DialogType } from "../shared/GameInterface";
import { ColyseusManager } from "../../Libs/ColyseusManager";
const { ccclass, property } = _decorator;

@ccclass("DialogEndGame")
export class DialogEndGame extends Component {
  @property({ type: Label })
  scoreLabel: Label;

  init(score: string) {
    this.scoreLabel.string = score;
  }

  onButtonHomClick() {
    G.gameRoot.hideDialog(DialogType.DialogEndGame);
    director.loadScene("game");
    ColyseusManager.Instance().EndGame();
  }
}
