import { _decorator, Component, Node, UITransform, Vec3 } from "cc";
import { G } from "../G";
const { ccclass, property } = _decorator;

@ccclass("FeatUIPosition")
export class FeatUIPosition extends Component {
  @property({ type: String })
  pos: string;

  start() {
    G.FeatUIComponents.push(this);
  }
  init() {
    switch (this.pos) {
      case "Bottom":
        let height = (G.screenHeight - G.sceneHeight) / 2;
        let width = G.screenWidth;
        let nodeTransforms = this.node.getComponent(UITransform);
        this.node.setScale(
          new Vec3(width / nodeTransforms.width, height / nodeTransforms.height)
        );
        break;
    }
  }
}
