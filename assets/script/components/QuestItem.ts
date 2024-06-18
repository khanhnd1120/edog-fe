import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from "cc";
import { DailyQuestType } from "../shared/GameInterface";
import api from "../shared/API";
import { G } from "../G";
const { ccclass, property } = _decorator;

@ccclass("QuestItem")
export class QuestItem extends Component {
  @property({ type: Label })
  nameLabel: Label;
  @property({ type: Label })
  descriptionLabel: Label;
  @property({ type: Node })
  btnGo: Node;
  @property({ type: Node })
  btnClaim: Node;

  type: DailyQuestType;
  id: number;
  data: any;
  init({
    name,
    description,
    data,
    canClaim,
    isClaimed,
    type,
    id,
  }: {
    name: string;
    description: string;
    data: any;
    isClaimed: boolean;
    canClaim: boolean;
    type: DailyQuestType;
    id: number;
  }) {
    this.nameLabel.string = name;
    this.descriptionLabel.string = description;
    this.btnClaim.active = false;
    this.btnGo.active = false;
    if (canClaim) {
      this.btnClaim.active = true;
    } else {
      if (!isClaimed) {
        this.btnGo.active = true;
      }
    }
    this.type = type;
    this.id = id;
    this.data = data;
    console.log({ data });
  }
  async onGoClick() {
    switch (this.type) {
      case DailyQuestType.VisitLink:
        window.open(this.data.url, "_blank");
        break;
      case DailyQuestType.Referral:
        break;
    }
    const { customerDailyQuestInfo } = await api.processQuest(this.id);
    G.dataStore.customerDailyQuest$.next(customerDailyQuestInfo);
  }
  async onClaimClick() {
    const { customerDailyQuestInfo, dailyQuests } =
      await api.claimCustomerDailyQuest(this.id);
    G.dataStore.customerDailyQuest$.next(customerDailyQuestInfo);
    G.dataStore.dailyQuest$.next(dailyQuests);
  }
}
