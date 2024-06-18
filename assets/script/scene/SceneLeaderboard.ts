import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import { G } from "../G";
import api from "../shared/API";
import { LeaderboardItem } from "../components/LeaderboardItem";
import { CustomerInfo } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("SceneLeaderboard")
export class SceneLeaderboard extends Component {
  @property({ type: Prefab })
  leaderboardItem: Prefab;
  @property({ type: Node })
  leaderboardContent: Node;
  @property({ type: LeaderboardItem })
  myLeaderboard: LeaderboardItem;
  @property({ type: Label })
  coolDownText: Label;

  coolDown: number;
  items: Node[];

  async start() {
    if (!G.gameRoot) return;
    G.gameRoot.hideAllDialog();
    const { leaderboardInfos, customerInfo, cooldown } =
      await api.getLeaderboards();
    this.coolDown = cooldown;
    if (this.items) {
      this.items.map((item) => {
        item.destroy();
      });
    }
    this.items = [];
    leaderboardInfos.map((info: CustomerInfo, index: number) => {
      let item = instantiate(this.leaderboardItem);
      this.leaderboardContent.addChild(item);
      item.getComponent(LeaderboardItem).init({ customerInfo: info, index });
      this.items.push(item);
    });
    this.myLeaderboard.init({ customerInfo, index: 0, isMy: true });
    setInterval(() => {
      this.updateCoolDown();
    }, 1000);
  }

  updateCoolDown() {
    if (this.coolDown) {
      this.coolDown -= 1;
      let hour = Math.floor(this.coolDown / 3600);
      let minute = Math.floor((this.coolDown - hour * 3600) / 60);
      let seconds = Math.floor(this.coolDown - hour * 3600 - minute * 60);
      this.coolDownText.string = `Reward send in: ${this.formatNumber(
        hour
      )}:${this.formatNumber(minute)}:${this.formatNumber(seconds)}`;
    }
  }
  formatNumber(val: number) {
    if (val < 10) return `0${val}`;
    return `${val}`;
  }
}
