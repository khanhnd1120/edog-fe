import { _decorator, Component, Label, Node, ProgressBar, Vec3 } from "cc";
import { G } from "../G";
const { ccclass, property } = _decorator;

enum PlayerDirection {
  Up,
  Down,
}
@ccclass("Player")
export class Player extends Component {
  @property({ type: Node })
  player: Node;
  @property({ type: Node })
  combo: Node;
  @property({ type: Label })
  comboLabel: Label;
  @property({ type: Node })
  comboCounter: Node;

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
    this.combo.active = false;
  }

  init(serverObject: any) {
    if (!serverObject) return;
    serverObject.listen("center", ({ x, y }: { x: number; y: number }) => {
      const { x: newX, y: newY } = G.convertPosition({ x, y });
      this.node.setPosition(newX, newY);
    });

    serverObject.listen("comboPoint", (comboPoint: number) => {
      const mul = Math.floor(comboPoint / 100);
      if (mul > 0) {
        this.combo.active = true;
        this.comboLabel.string = `Combo X${mul}`;
        this.comboCounter.getComponent(ProgressBar).progress = mul / 5;
      } else {
        this.combo.active = false;
      }
    });
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
