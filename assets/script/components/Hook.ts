import { _decorator, Component, math, misc, Node, Quat, Vec3 } from "cc";
import { G } from "../G";
const { ccclass, property } = _decorator;

@ccclass("Hook")
export class Hook extends Component {
  serverObject: any;
  x: number = 0;
  y: number = 0;
  angle: number = 0;
  preAngle: number = 0;

  init({ serverObject }: { serverObject: any }) {
    serverObject.listen("pos", ({ x, y }: { x: number; y: number }) => {
      const { x: newX, y: newY } = G.convertPosition({ x, y });
      this.x = newX;
      this.y = newY;
    });
    serverObject.listen("angle", (angle: number) => {
      this.angle = angle;
    });
  }
  update(dt: number) {
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

    let r = math.lerp(this.preAngle, this.angle, s);

    this.node.setRotationFromEuler(new Vec3(0, 0, r));
    this.preAngle = r;
  }
}
