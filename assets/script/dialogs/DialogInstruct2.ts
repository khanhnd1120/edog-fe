import { _decorator, Component, input, Input, KeyCode, Node } from "cc";
import { G } from "../G";
import { DialogType } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("DialogInstruct2")
export class DialogInstruct2 extends Component {
  start() {
    input.on(Input.EventType.KEY_DOWN, (event) => {
      switch (event.keyCode) {
        case KeyCode.SPACE:
          if (this.node.active) {
            G.gameRoot.hideDialog(DialogType.Instruct2);
            G.enterGame();
            break;
          }
      }
    });
  }
}
