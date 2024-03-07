import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SceneHall")
export class SceneHall extends Component {
  start() {}

  onBtnStartClick() {
    director.loadScene("game");
  }
}
