import { _decorator, Component, instantiate, Node, tween, Vec3 } from "cc";
import { DialogType } from "./GameInterface";
const { ccclass, property } = _decorator;

const START_POSITION: Vec3 = new Vec3(0, 100, 0);
const ANIMATION_DURATION = 0.3;

@ccclass("GameRoot")
export class GameRoot extends Component {
  @property({ type: [Node] })
  dialogNodes: Node[] = [];
  @property({ type: Node })
  background: Node = null;
  dialogBg: Node[] = [];

  start() {
    this.background.active = false;
    this.dialogNodes.forEach((n: Node) => {
      n.active = false;
    });
  }

  public hideDialog(type: DialogType) {
    let node = this.dialogNodes[type];
    tween(node)
      .to(
        ANIMATION_DURATION,
        { position: START_POSITION },
        {
          easing: "backIn",
          onComplete: () => {
            node.active = false;
            this.dialogBg[type].destroy();
          },
        }
      )
      .start();
  }

  public async showDialog(type: DialogType) {
    const node = this.dialogNodes[type];
    if (!node) {
      return console.error(
        `[dialog_manager] node [${DialogType[type]}] not found`
      );
    }

    let bg = instantiate(this.background);
    bg.active = true;
    node.parent.addChild(bg);
    node.setSiblingIndex(node.parent.children.length + 1);
    node.setPosition(START_POSITION);
    this.dialogBg[type] = bg;
    node.active = true;
    tween(node)
      .to(
        ANIMATION_DURATION,
        { position: new Vec3(0, -40, 0) },
        {
          easing: "backOut",
        }
      )
      .start();
  }
}
