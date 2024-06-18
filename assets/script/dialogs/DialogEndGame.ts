import { _decorator, Component, director, Label, Node } from "cc";
import { G } from "../G";
import { DialogType } from "../shared/GameInterface";
import { ColyseusManager } from "../../Libs/ColyseusManager";
const { ccclass, property } = _decorator;

@ccclass("DialogEndGame")
export class DialogEndGame extends Component {
  @property({ type: Label })
  scoreLabel: Label;
  @property({ type: Label })
  aptLabel: Label;
  @property({ type: Label })
  egonLabel: Label;

  setScore(score: string) {
    this.scoreLabel.string = score;
  }

  setAPTEarned(aptAmount: string) {
    this.aptLabel.string = aptAmount;
  }

  setEgonEarned(amount: string) {
    this.egonLabel.string = amount;
  }

  onButtonReplayClick() {
    ColyseusManager.Instance().EndGame();
    director.loadScene("loading");
  }
}
