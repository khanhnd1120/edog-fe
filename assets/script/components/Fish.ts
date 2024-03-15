import {
  _decorator,
  Component,
  Node,
  Quat,
  sp,
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
  @property({ type: [UITransform] })
  boxs: UITransform[] = [];
  serverObject: any;
  x: number = 0;
  y: number = 0;
  isPulled: boolean = false;

  init({
    id,
    x,
    y,
    width,
    height,
    serverObject,
    direction,
  }: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    serverObject: any;
    direction: Direction;
  }) {
    let skeleton = this.node.getComponent(sp.Skeleton);
    // @ts-ignore
    skeleton.defaultSkin = id;
    setTimeout(() => {
      skeleton.animation = "idle";
    }, 10);
    if (direction == Direction.Left) {
      this.node.setScale(
        new Vec3(width / this.boxs[id].width, +width / this.boxs[id].width, 1)
      );
    } else {
      this.node.setScale(
        new Vec3(-width / this.boxs[id].width, +width / this.boxs[id].width, 1)
      );
    }
    this.node.setPosition(x, y);
    this.x = this.convertPosToCenter(x, y).x;
    this.y = this.convertPosToCenter(x, y).y;
    this.node.setPosition(this.x, this.y);
    // set width; height
    this.node.getComponent(UITransform).width = width;
    this.node.getComponent(UITransform).height = height;
    serverObject.listen("pos", ({ x, y }: { x: number; y: number }) => {
      const { x: newX, y: newY } = G.convertPosition({ x, y });
      this.x = this.convertPosToCenter(newX, newY).x;
      this.y = this.convertPosToCenter(newX, newY).y;
    });
    serverObject.listen("isPulled", (isPulled: boolean) => {
      if (isPulled) {
        this.isPulled = isPulled;
        if (direction == Direction.Left) {
          this.node.rotate(new Quat(0, 0, -1));
        } else {
          this.node.rotate(new Quat(0, 0, 1));
        }
        setTimeout(() => {
          skeleton.animation = "get_caught";
        }, 10);
      }
    });
  }

  update(dt: number) {
    if (
      Math.abs(this.x - this.node.position.x) > 5 * G.unit ||
      Math.abs(this.y - this.node.position.y) > 5 * G.unit
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

  convertPosToCenter(x: number, y: number) {
    if (this.isPulled) {
      return {
        x: x,
        y:
          y -
          Math.abs(
            this.node.getComponent(UITransform).height * this.node.scale.y
          ) /
            2,
      };
    }
    return {
      x:
        x +
        Math.abs(
          this.node.getComponent(UITransform).height * this.node.scale.y
        ) /
          2,
      y:
        y +
        Math.abs(
          this.node.getComponent(UITransform).height * this.node.scale.y
        ) /
          2 +
        0.75 * G.unit,
    };
  }
}
