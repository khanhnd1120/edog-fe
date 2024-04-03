import {
  _decorator,
  AudioSource,
  Component,
  math,
  misc,
  Node,
  Quat,
  Vec3,
} from "cc";
import { G } from "../G";
const { ccclass, property } = _decorator;
enum HookState {
  Rotate,
  Push,
  Pull,
}
@ccclass("Hook")
export class Hook extends Component {
  @property({ type: AudioSource })
  hookingSfx: AudioSource;
  @property({ type: AudioSource })
  fishOnHookSfx: AudioSource;
  serverObject: any;
  x: number = 0;
  y: number = 0;
  angle: number = 0;
  preAngle: number = 0;
  isFishOnHook: boolean;;

  init({ serverObject }: { serverObject: any }) {
    serverObject.listen("pos", ({ x, y }: { x: number; y: number }) => {
      const { x: newX, y: newY } = G.convertPosition({ x, y });
      this.x = newX;
      this.y = newY;
    });
    serverObject.listen("angle", (angle: number) => {
      this.angle = angle;
    });
    serverObject.listen("isFishOnHook", (isFishOnHook: any) => {
      this.isFishOnHook = isFishOnHook;
    });
    serverObject.listen("state", (state: HookState) => {
      switch (state) {
        case HookState.Rotate:
          this.hookingSfx.stop();
          this.fishOnHookSfx.stop();
          break;
        case HookState.Pull:
        case HookState.Push:
          this.hookingSfx.play();
          if (this.isFishOnHook) {
            this.fishOnHookSfx.play();
          }
          break;
      }
    });
  }
  update(dt: number) {
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

    let r = math.lerp(this.preAngle, this.angle, s);

    this.node.setRotationFromEuler(new Vec3(0, 0, r));
    this.preAngle = r;
  }
}
