import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from "cc";
import { CustomerInfo } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("LeaderboardItem")
export class LeaderboardItem extends Component {
  @property({ type: [SpriteFrame] })
  iconTop3: SpriteFrame[] = [];
  @property({ type: SpriteFrame })
  bgNormal: SpriteFrame;
  @property({ type: SpriteFrame })
  bgMyItem: SpriteFrame;
  @property({ type: Sprite })
  icon: Sprite;
  @property({ type: Label })
  indexLabel: Label;
  @property({ type: Label })
  nameLabel: Label;
  @property({ type: Label })
  pointLabel: Label;
  @property({ type: Label })
  rewardLabel: Label;
  @property({ type: Sprite })
  bgItem: Sprite;

  init({
    customerInfo,
    index,
    reward,
    isMy = false,
  }: {
    customerInfo: CustomerInfo;
    index: number;
    reward: number;
    isMy?: boolean;
  }) {
    if (index != -1 && index < 3) {
      this.indexLabel.node.active = false;
      this.icon.spriteFrame = this.iconTop3[index];
    } else {
      this.icon.node.active = false;
      this.indexLabel.string = `${index != -1 ? index + 1 : "10+"}`;
    }
    if (isMy) {
      this.bgItem.spriteFrame = this.bgMyItem;
    } else {
      this.bgItem.spriteFrame = this.bgNormal;
    }
    let name = customerInfo.user_name;
    if (!name) {
      name = customerInfo.twitter_username;
    }
    if (!name) {
      name = customerInfo.first_name + " " + customerInfo.last_name;
    }
    if (!name) {
      name = customerInfo.telegram_id;
    }
    this.nameLabel.string = name;
    this.pointLabel.string = `${customerInfo.high_score_day}`;
    this.rewardLabel.string = `${reward}`;
  }
}
