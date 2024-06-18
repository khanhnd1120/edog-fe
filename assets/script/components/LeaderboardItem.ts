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
  @property({ type: Sprite })
  bgItem: Sprite;

  init({
    customerInfo,
    index,
    isMy = false,
  }: {
    customerInfo: CustomerInfo;
    index: number;
    isMy?: boolean;
  }) {
    if (index < 3) {
      this.indexLabel.node.active = false;
      this.icon.spriteFrame = this.iconTop3[index];
    } else {
      this.icon.node.active = false;
      this.indexLabel.string = `${index + 1}`;
    }
    if (isMy) {
      this.bgItem.spriteFrame = this.bgMyItem;
    } else {
      this.bgItem.spriteFrame = this.bgNormal;
    }
    this.nameLabel.string = customerInfo.user_name;
    this.pointLabel.string = `${customerInfo.high_score_day}`;
  }
}
