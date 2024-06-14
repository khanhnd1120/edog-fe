import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { Reward } from "./Reward";
const { ccclass, property } = _decorator;

@ccclass("FishesCaught")
export class FishesCaught extends Component {
  @property({ type: Node })
  content: Node;
  @property({ type: Prefab })
  rewardPrefab: Prefab;

  serverObject: any;
  rewards: Node[];

  init({ serverObject }: { serverObject: any }) {
    this.rewards = [];
    serverObject.onAdd((reward: any) => {
      if (this.rewards.length >= 8) {
        let item = this.rewards.shift();
        this.node.removeChild(item);
        item.destroy();
      }
      const item = instantiate(this.rewardPrefab);
      item
        .getComponent(Reward)
        .init({ total: reward.score, bonus: reward.bonus, playOnLoad: false });
      this.content.addChild(item);
      this.rewards.push(item);
      this.content.children.reverse();
    });
  }
}
