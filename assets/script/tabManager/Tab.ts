import { _decorator, Component, director, Node, Sprite, SpriteFrame } from "cc";
import { TabManager } from "./TabManager";
const { ccclass, property } = _decorator;

@ccclass("Tab")
export class Tab extends Component {
  @property({ type: SpriteFrame })
  activeBg: SpriteFrame;
  @property({ type: SpriteFrame })
  inactiveBg: SpriteFrame;
  @property({ type: Sprite })
  bg: Sprite;
  @property({ type: String })
  scene: string;
  @property({ type: Number })
  index: number;
  @property({ type: TabManager })
  tabManager: TabManager;

  isActive: boolean;

  public setActive(isActive: boolean) {
    if (isActive) {
      this.bg.spriteFrame = this.activeBg;
      director.loadScene(this.scene);
    }
    if (!isActive) {
      this.bg.spriteFrame = this.inactiveBg;
    }
  }

  public onClick() {
    this.tabManager.toggle(this.index);
  }
}
