import { _decorator, Component, Node, UITransform } from "cc";
import { Direction } from "../shared/GameInterface";
import { G } from "../G";
const { ccclass, property } = _decorator;

@ccclass("LayerAnimation")
export class LayerAnimation extends Component {
  isInit: boolean = false;
  speed: number = 0;
  direction: Direction = Direction.Left;

  update(deltaTime: number) {
    if (this.isInit) {
      let newX = this.node.position.x;
      switch (this.direction) {
        case Direction.Left:
          newX -= this.speed;
          break;
        case Direction.Right:
          newX += this.speed;
          break;
      }
      if (newX < -G.sceneWidth) {
        newX = G.sceneWidth;
      }
      if (newX > G.sceneWidth) {
        newX = -G.sceneWidth;
      }
      this.node.setPosition(newX, this.node.position.y);
    }
  }

  init({
    width,
    height,
    x,
    y,
    speed,
    direction,
  }: {
    width: number;
    height: number;
    x: number;
    y: number;
    speed?: number;
    direction?: Direction;
  }) {
    this.node.setPosition(x, y);
    this.node.getComponent(UITransform).width = width;
    this.node.getComponent(UITransform).height = height;
    this.speed = speed;
    this.direction = direction;
    this.isInit = true;
  }
}
