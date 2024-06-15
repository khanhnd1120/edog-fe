import {
  _decorator,
  AudioSource,
  Component,
  Label,
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
  @property({ type: Label })
  pointLabel: Label;
  @property({ type: Node })
  point: Node;
  @property({ type: [Node] })
  boxs: Node[] = [];
  @property({ type: Node })
  aptCoin: Node;
  @property({ type: Node })
  egonCoin: Node;
  serverObject: any;
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  isPulled: boolean = false;

  init({
    id,
    x,
    y,
    width,
    height,
    serverObject,
    direction,
    aptCoin = 0,
    egonCoin = 0,
  }: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    serverObject: any;
    direction: Direction;
    aptCoin?: number;
    egonCoin?: number;
  }) {
    let skeleton = this.node.getComponent(sp.Skeleton);
    // @ts-ignore
    skeleton.defaultSkin = id;
    setTimeout(() => {
      skeleton.animation = "idle";
    }, 20);
    const boxUI = this.boxs[id].getComponent(UITransform);
    if (direction == Direction.Left) {
      this.node.setScale(new Vec3(width / boxUI.width, width / boxUI.width, 1));
    } else {
      this.node.setScale(
        new Vec3(-width / boxUI.width, width / boxUI.width, 1)
      );
      this.point.setScale(-1, 1, 0);
    }
    this.x = this.convertPosToCenter(x, y).x;
    this.y = this.convertPosToCenter(x, y).y;
    this.node.setPosition(this.x, this.y);
    // set width; height
    this.width = boxUI.width;
    this.height = boxUI.height;
    // set point pos
    this.point.setPosition(
      this.boxs[id].position.x,
      this.boxs[id].position.y + boxUI.height / 2
    );
    // icon coin
    this.point.active = true;
    this.aptCoin.active = false;
    this.egonCoin.active = false;

    if (aptCoin > 0) {
      this.aptCoin.active = true;
      this.point.active = false;
    }
    if (egonCoin > 0) {
      this.egonCoin.active = true;
      this.point.active = false;
    }

    this.aptCoin.setPosition(
      this.boxs[id].position.x - boxUI.height / 2,
      this.boxs[id].position.y + boxUI.height / 6
    );
    this.egonCoin.setPosition(
      this.boxs[id].position.x - boxUI.height / 2,
      this.boxs[id].position.y + boxUI.height / 6
    );
    serverObject.listen("pos", ({ x, y }: { x: number; y: number }) => {
      const { x: newX, y: newY } = G.convertPosition({ x, y });
      this.x = this.convertPosToCenter(newX, newY).x;
      this.y = this.convertPosToCenter(newX, newY).y;
    });
    serverObject.listen("score", (score: number) => {
      this.pointLabel.string = `${score}`;
    });
    serverObject.listen("isActive", (isActive: boolean) => {
      this.node.active = isActive;
    });
    serverObject.listen("aptCoin", (aptCoin: number) => {
      if (aptCoin <= 0) {
        this.aptCoin.active = false;
      }
      if(!this.egonCoin.active && !this.aptCoin.active) {
        this.point.active = true;
      }
    });
    serverObject.listen("egonCoin", (egonCoin: number) => {
      if (egonCoin <= 0) {
        this.egonCoin.active = false;
      }
      if(!this.egonCoin.active && !this.aptCoin.active) {
        this.point.active = true;
      }
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
    let s = 6 * dt;
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
          Math.abs(this.height * this.node.scale.y) *
            (1 - this.node.getComponent(UITransform).anchorPoint.y),
      };
    }
    return {
      x:
        x +
        Math.abs(this.width * this.node.scale.x) *
          (1 - this.node.getComponent(UITransform).anchorPoint.x),
      y:
        y +
        Math.abs(this.height * this.node.scale.y) *
          this.node.getComponent(UITransform).anchorPoint.y,
    };
  }
}
