import { _decorator, Component, Node, Vec3 } from "cc";
import { G } from "../G";
const { ccclass, property } = _decorator;

enum PlayerDirection {
  Up,
  Down,
}
@ccclass("Player")
export class Player extends Component {
  rootPos: Vec3;
  nextPos: Vec3;
  minRange = 20;
  maxRange = 30;
  direction: PlayerDirection;

  start() {
    this.rootPos = this.node.position;
    this.nextPos = new Vec3(
      this.rootPos.x,
      this.rootPos.y + G.getRndInteger(this.minRange, this.maxRange)
    );
    this.direction = PlayerDirection.Up;
  }

  update(dt: number) {
    if (Math.abs(this.node.position.y - this.nextPos.y) < 10) {
      switch (this.direction) {
        case PlayerDirection.Up:
          this.direction = PlayerDirection.Down;
          this.nextPos = this.nextPos = new Vec3(
            this.rootPos.x,
            this.rootPos.y - G.getRndInteger(this.minRange, this.maxRange)
          );
          break;
        case PlayerDirection.Down:
          this.direction = PlayerDirection.Up;
          this.nextPos = this.nextPos = new Vec3(
            this.rootPos.x,
            this.rootPos.y + G.getRndInteger(this.minRange, this.maxRange)
          );
          break;
      }
    }
    let s = 0.5 * dt;
    s = Math.min(s, 1.0);
    let lerp = new Vec3(0, 0, 0);
    let t = Vec3.lerp<Vec3>(
      lerp,
      this.node.position,
      new Vec3(this.nextPos.x, this.nextPos.y),
      s
    );
    this.node.setPosition(t);
  }
}
