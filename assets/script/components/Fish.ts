import {
  _decorator,
  Component,
  Node,
  Sprite,
  SpriteFrame,
  UITransform,
  Vec3,
} from "cc";
import { Direction } from "../shared/GameInterface";
import { G } from "../G";
const { ccclass, property } = _decorator;

@ccclass("Fish")
export class Fish extends Component {
  serverObject: any;
  x: number = 0;
  y: number = 0;

  init({
    spriteFrame,
    x,
    y,
    width,
    height,
    serverObject,
    direction,
  }: {
    spriteFrame: SpriteFrame;
    x: number;
    y: number;
    width: number;
    height: number;
    serverObject: any;
    direction: Direction;
  }) {
    this.node.getComponent(Sprite).spriteFrame = spriteFrame;
    if (direction == Direction.Left) {
      this.node.getComponent(Sprite).spriteFrame.flipUVX = true;
    }
    this.node.setPosition(x, y);
    this.x = x;
    this.y = y;
    // set width; height
    this.node.getComponent(UITransform).width = width;
    this.node.getComponent(UITransform).height = height;
    serverObject.listen("pos", ({ x, y }: { x: number; y: number }) => {
      const { x: newX, y: newY } = G.convertPosition({ x, y });
      this.x = newX;
      this.y = newY;
    });
  }

  update(dt: number) {
    if (
      Math.abs(this.x - this.node.position.x) > 100 ||
      Math.abs(this.y - this.node.position.y) > 100
    ) {
      this.node.setPosition(this.x, this.y);
      return;
    }
    let s = 4 * dt;
    s = Math.min(s, 1.0);
    let lerp = new Vec3(0, 0, 0);
    let t = Vec3.lerp<Vec3>(
      lerp,
      this.node.position,
      new Vec3(this.x, this.y),
      s
    );
    this.node.setPosition(t);
  }
}
