import {
  _decorator,
  Component,
  instantiate,
  Label,
  Node,
  Prefab,
  ProgressBar,
  tween,
  Vec3,
} from "cc";
import { G } from "../G";
import { Reward } from "./Reward";
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
  @property({ type: Prefab })
  rewardPrefab: Prefab;

  rootPos: Vec3;
  nextPos: Vec3;
  minRange = 20;
  maxRange = 30;
  direction: PlayerDirection;
  comboVal: number;

  start() {
    this.rootPos = this.node.position;
    this.nextPos = new Vec3(
      this.rootPos.x,
      this.rootPos.y + G.getRndInteger(this.minRange, this.maxRange)
    );
    this.direction = PlayerDirection.Up;
  }

  init(serverObject: any) {
    this.comboVal = 0;
    if (!serverObject) return;
    serverObject.listen("center", ({ x, y }: { x: number; y: number }) => {
      const { x: newX, y: newY } = G.convertPosition({ x, y });
      this.node.setPosition(newX, newY);
    });

    serverObject.listen("comboPoint", (comboPoint: number) => {
      const mul = Math.floor(comboPoint / 100);
      if (mul == this.comboVal) {
        tween()
          .target(this.comboCounter.getComponent(ProgressBar))
          .to(
            1.0 / (this.comboVal - mul + 1),
            {
              progress: ((comboPoint % 100) / 100) * 0.5,
            },
            {
              onComplete: () => {
                if (this.comboVal < mul) {
                  this.comboCounter.getComponent(ProgressBar).progress = 0;
                }
                this.comboVal = mul;
              },
            }
          )
          .start();
      } else {
        let anim = (i: number, max: number, time: number) => {
          console.log(this.comboVal, mul);
          let to = ((comboPoint % 100) / 100) * 0.5;
          if (i >= max) {
            tween()
              .target(this.comboCounter.getComponent(ProgressBar))
              .to(0.2, {
                progress: to,
              })
              .start();
            return;
          }
          if (this.comboVal < mul) {
            to = 0.5;
          } else {
            to = 0;
          }
          tween()
            .target(this.comboCounter.getComponent(ProgressBar))
            .to(
              time,
              {
                progress: to,
              },
              {
                onComplete: () => {
                  if (this.comboVal < mul) {
                    this.comboVal = this.comboVal + 1;
                    this.comboCounter.getComponent(ProgressBar).progress = 0;
                  } else if (this.comboVal > mul) {
                    this.comboVal = this.comboVal - 1;
                    this.comboCounter.getComponent(ProgressBar).progress = 0.5;
                  }
                  this.comboLabel.string = `Combo X${this.comboVal}`;
                  tween()
                    .target(this.comboLabel)
                    .to(0.5, { fontSize: 28 * (1 + this.comboVal * 0.1) })
                    .start();
                  // this.comboLabel.fontSize = ;
                  anim(i + 1, max, time);
                },
              }
            )
            .start();
        };
        anim(
          0,
          Math.abs(this.comboVal - mul),
          1.0 / Math.abs(this.comboVal - mul)
        );
        for (let index = 0; index < Math.abs(this.comboVal - mul); index++) {
          // setTimeout(() => {},
          // ((i * 1.0) / Math.abs(this.comboVal - mul)) * 1000);
        }
      }
    });

    serverObject.listen(
      "lastReward",
      (lastReward: { lastTotal: number; lastBonus: number }) => {
        if (!lastReward) {
          return;
        }
        const item = instantiate(this.rewardPrefab);
        item
          .getComponent(Reward)
          .init({ total: lastReward.lastTotal, bonus: lastReward.lastBonus });
        this.node.addChild(item);
      }
    );
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
