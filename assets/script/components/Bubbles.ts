import {
  _decorator,
  Component,
  instantiate,
  math,
  Node,
  Prefab,
  UIOpacity,
  Vec3,
} from "cc";
import { G } from "../G";
const { ccclass, property } = _decorator;

@ccclass("Bubbles")
export class Bubbles extends Component {
  @property({ type: Prefab })
  bubblePrefab: Prefab;
  maxPosition: number;
  lastRender: number;

  listItems: Node[] = [];
  start() {
    this.listItems = [];
    this.maxPosition = 200;
    this.lastRender = new Date().getTime();
  }

  update(dt: number) {
    if (
      this.listItems.length < 3 &&
      Math.random() < 0.1 &&
      new Date().getTime() > this.lastRender + 1000
    ) {
      const node = instantiate(this.bubblePrefab);
      node.setPosition(new Vec3(0, 0, 0));
      this.node.addChild(node);
      this.listItems.push(node);
      this.lastRender = new Date().getTime();
      const scale = Math.random();
      node.setScale(scale, scale);
      node.getComponent(UIOpacity).opacity = 0;
    }
    this.listItems = this.listItems.filter((item) => {
      if (!item.active) {
        item.destroy();
        return false;
      }
      return true;
    });
    this.listItems.map((item) => {
      if (item.position.y > this.maxPosition - 50) {
        item.active = false;
      }
      if (item.position.y < 0.75 * (this.maxPosition - 50)) {
        let r = math.lerp(item.getComponent(UIOpacity).opacity, 255, 4 * dt);
        item.getComponent(UIOpacity).opacity = r;
      } else {
        let r = math.lerp(item.getComponent(UIOpacity).opacity, 0, 10 * dt);
        item.getComponent(UIOpacity).opacity = r;
      }

      let s = 0.5 * dt;
      s = Math.min(s, 1.0);
      let lerp = new Vec3(0, 0, 0);
      let t = Vec3.lerp<Vec3>(
        lerp,
        item.position,
        new Vec3(G.getRndInteger(-50, 50), this.maxPosition),
        s
      );
      item.setPosition(t);
    });
  }
}
