import {
  _decorator,
  Component,
  instantiate,
  Label,
  Node,
  Prefab,
  Sprite,
  SpriteFrame,
} from "cc";
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
  curLeaderboardContent: Node;
  @property({ type: Node })
  prevLeaderboardContent: Node;
  @property({ type: Node })
  curLeaderboard: Node;
  @property({ type: Node })
  prevLeaderboard: Node;
  @property({ type: LeaderboardItem })
  myLeaderboard: LeaderboardItem;
  @property({ type: Label })
  coolDownText: Label;
  @property({ type: Sprite })
  btnCurrent: Sprite;
  @property({ type: Sprite })
  btnPrevious: Sprite;
  @property({ type: SpriteFrame })
  activeBg: SpriteFrame;
  @property({ type: SpriteFrame })
  inactiveBg: SpriteFrame;

  coolDown: number;
  currentItems: Node[];
  previousItems: Node[];

  async start() {
    if (!G.gameRoot) return;
    G.gameRoot.hideAllDialog();
    this.loadCurrentLeaderboard();
    setInterval(() => {
      this.updateCoolDown();
    }, 1000);
  }

  async loadPreviousLeaderboard() {
    this.btnCurrent.spriteFrame = this.inactiveBg;
    this.btnPrevious.spriteFrame = this.activeBg;
    this.curLeaderboard.active = false;
    this.prevLeaderboard.active = true;
    const { leaderboardInfos, rewards } = await api.getPreLeaderboards();
    if (this.previousItems) {
      this.previousItems.map((item) => {
        item.destroy();
      });
    }
    this.previousItems = [];
    leaderboardInfos.map((info: CustomerInfo, index: number) => {
      let item = instantiate(this.leaderboardItem);
      this.prevLeaderboardContent.addChild(item);
      item
        .getComponent(LeaderboardItem)
        .init({ customerInfo: info, index, reward: rewards[index] });
      this.previousItems.push(item);
    });
  }

  async loadCurrentLeaderboard() {
    this.btnCurrent.spriteFrame = this.activeBg;
    this.btnPrevious.spriteFrame = this.inactiveBg;
    this.curLeaderboard.active = true;
    this.prevLeaderboard.active = false;
    const { leaderboardInfos, customerInfo, cooldown, rewards } =
      await api.getLeaderboards();
    this.coolDown = cooldown;
    if (this.currentItems) {
      this.currentItems.map((item) => {
        item.destroy();
      });
    }
    this.currentItems = [];
    leaderboardInfos.map((info: CustomerInfo, index: number) => {
      let item = instantiate(this.leaderboardItem);
      this.curLeaderboardContent.addChild(item);
      item
        .getComponent(LeaderboardItem)
        .init({ customerInfo: info, index, reward: rewards[index] });
      this.currentItems.push(item);
    });
    let myIndex = leaderboardInfos
      .map((info: CustomerInfo) => info.id)
      .indexOf(customerInfo.id);
    this.myLeaderboard.init({
      customerInfo,
      index: myIndex,
      isMy: true,
      reward: rewards[myIndex] ?? 0,
    });
  }

  updateCoolDown() {
    if (this.coolDown && this.coolDownText) {
      this.coolDown -= 1;
      let hour = Math.floor(this.coolDown / 3600);
      let minute = Math.floor((this.coolDown - hour * 3600) / 60);
      let seconds = Math.floor(this.coolDown - hour * 3600 - minute * 60);
      this.coolDownText.string = `Reward will be sent in: ${this.formatNumber(
        hour
      )}:${this.formatNumber(minute)}:${this.formatNumber(seconds)}`;
    }
  }
  formatNumber(val: number) {
    if (val < 10) return `0${val}`;
    return `${val}`;
  }
}
