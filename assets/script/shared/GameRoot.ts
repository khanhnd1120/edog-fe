import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  tween,
  Vec3,
} from "cc";
import { DialogType } from "./GameInterface";
import { NewsManager } from "../news/NewsManager";
import { Toast } from "../components/Toast";
const { ccclass, property } = _decorator;

const START_POSITION: Vec3 = new Vec3(0, 100, 0);
const ANIMATION_DURATION = 0.3;

@ccclass("GameRoot")
export class GameRoot extends Component {
  @property({ type: [Node] })
  dialogNodes: Node[] = [];
  @property({ type: Node })
  background: Node = null;
  @property({ type: NewsManager })
  newsManager: NewsManager = null;
  @property({ type: Node })
  tutorial: Node = null;
  @property({ type: Prefab })
  toastPrefab: Prefab = null;
  dialogBg: Node[] = [];

  start() {
    this.background.active = false;
    this.dialogNodes.forEach((n: Node) => {
      n.active = false;
    });
  }

  public showTutorial() {
    this.tutorial.active = true;
  }

  public hideTutorial() {
    this.tutorial.active = false;
  }

  public hideDialog(type: DialogType) {
    if (!this.dialogBg[type]) {
      return;
    }
    let node = this.dialogNodes[type];
    tween(node)
      .to(
        ANIMATION_DURATION,
        { position: START_POSITION },
        {
          easing: "backIn",
          onComplete: () => {
            node.active = false;
            if (this.dialogBg[type]) {
              this.dialogBg[type].destroy();
            }
            this.dialogBg[type] = null;
            console.log({ type });
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

  public showToast(content: string) {
    const toast = instantiate(this.toastPrefab);
    toast.getComponent(Toast).init({ content });
    this.node.addChild(toast);
  }

  public hideAllDialog() {
    for (let item in DialogType) {
      if (isNaN(Number(item))) {
        this.hideDialog(Number(DialogType[item]));
      }
    }
  }
}
