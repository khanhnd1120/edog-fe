import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from "cc";
import { DailyQuestType, DialogType } from "../shared/GameInterface";
import api from "../shared/API";
import { G } from "../G";
import { DialogClaimQuest } from "../dialogs/DialogClaimQuest";
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
  @property({ type: Node })
  nodeReward: Node;
  @property({ type: Node })
  inviteLinkNode: Node;
  @property({ type: Label })
  inviteLinkLabel: Label;
  @property({ type: Node })
  tooltipCopy: Node;
  @property({ type: Label })
  claimedLabel: Label;

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
    this.nodeReward.active = false;
    this.claimedLabel.node.active = false;
    this.inviteLinkNode.active = false;
    if (canClaim) {
      this.btnClaim.active = true;
      this.nodeReward.active = true;
    } else {
      if (!isClaimed) {
        this.btnGo.active = true;
        this.nodeReward.active = true;
      } else {
        this.claimedLabel.node.active = true;
      }
    }
    this.type = type;
    this.id = id;
    this.data = data;

    switch (this.type) {
      case DailyQuestType.VisitLink:
        this.inviteLinkNode.active = false;
        break;
      case DailyQuestType.Referral:
        if (
          G.dataStore.customerInfo$.value &&
          G.dataStore.customerInfo$.value.invite_link
        ) {
          this.inviteLinkNode.active = true;
          this.inviteLinkLabel.string =
            G.dataStore.customerInfo$.value.invite_link;
        }
        break;
    }
  }
  async onGoClick() {
    switch (this.type) {
      case DailyQuestType.VisitLink:
        window.open(this.data.url, "_blank");
        break;
      case DailyQuestType.Referral:
        console.log(G.dataStore.customerInfo$.value);
        if (
          G.dataStore.customerInfo$.value &&
          G.dataStore.customerInfo$.value.invite_link
        ) {
          this.inviteLinkNode.active = true;
          this.inviteLinkLabel.string =
            G.dataStore.customerInfo$.value.invite_link;
        }
        G.gameRoot.showToast("Check your message");
        break;
    }
    const { customerDailyQuestInfo } = await api.processQuest(this.id);
    G.dataStore.customerDailyQuest$.next(customerDailyQuestInfo);
  }
  async onClaimClick() {
    try {
      const { customerDailyQuestInfo, dailyQuests, amount } =
        await api.claimCustomerDailyQuest(this.id);
      G.dataStore.customerDailyQuest$.next(customerDailyQuestInfo);
      G.dataStore.dailyQuest$.next(dailyQuests);
      G.gameRoot.showDialog(DialogType.ClaimQuest);
      G.gameRoot.dialogNodes[DialogType.ClaimQuest]
        .getComponent(DialogClaimQuest)
        .init(amount);
    } catch (e) {}
  }

  onCopyInvitedLink() {
    window.navigator.clipboard.writeText(
      G.dataStore.customerInfo$.value.invite_link
    );
    this.tooltipCopy.active = true;
    setTimeout(() => {
      this.tooltipCopy.active = false;
    }, 1000);
  }
}
