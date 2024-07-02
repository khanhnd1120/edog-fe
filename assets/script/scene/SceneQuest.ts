import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import { G } from "../G";
import api from "../shared/API";
import { QuestItem } from "../components/QuestItem";
import { DailyQuestType } from "../shared/GameInterface";
import { combineLatest } from "../lib/rxjs";
const { ccclass, property } = _decorator;

@ccclass("SceneQuest")
export class SceneQuest extends Component {
  @property({ type: Prefab })
  questItem: Prefab;
  @property({ type: Node })
  content: Node;
  @property({ type: Label })
  coolDownText: Label;

  coolDown: number;
  items: Node[];
  async start() {
    if (!G.gameRoot) return;
    G.gameRoot.hideAllDialog();
    const { customerDailyQuestInfo, dailyQuests, cooldown } =
      await api.getCustomerDailyQuest();
    this.coolDown = cooldown;
    G.dataStore.dailyQuest$.next(dailyQuests);

    G.dataStore.customerDailyQuest$.subscribe((customerDailyQuestInfo) => {
      if (!customerDailyQuestInfo || !G.dataStore.dailyQuest$.value) return;
      if (this.items) {
        this.items.map((item) => {
          item.destroy();
        });
      }
      this.items = [];
      customerDailyQuestInfo.quest_ids.map((questId: number, index: number) => {
        if (!this.questItem) {
          return;
        }
        const questData = G.dataStore.dailyQuest$.value.find(
          (q) => q.id == questId
        );
        let canClaim = false;
        let isClaimed = false;
        if (questData) {
          switch (questData.type) {
            case DailyQuestType.Referral:
              if (customerDailyQuestInfo.number_rewards[index] > 0) {
                canClaim = true;
              }
              break;
            case DailyQuestType.VisitLink:
            case DailyQuestType.Retweet:
            case DailyQuestType.CommentTwitter:
            case DailyQuestType.QuoteTweet:
            case DailyQuestType.InstantTweet:
              if (customerDailyQuestInfo.claimed_ids.includes(questId)) {
                isClaimed = true;
              }
              if (
                !isClaimed &&
                customerDailyQuestInfo.number_rewards[index] > 0
              ) {
                canClaim = true;
              }
              break;
          }
          let item = instantiate(this.questItem);
          this.content.addChild(item);
          item.getComponent(QuestItem).init({
            name: questData.name,
            description: questData.description,
            data: questData.data,
            isClaimed,
            canClaim,
            type: questData.type,
            id: questId,
          });
          this.items.push(item);
        }
      });
    });
    G.dataStore.customerDailyQuest$.next(customerDailyQuestInfo);

    setInterval(() => {
      this.updateCoolDown();
    }, 1000);
  }

  updateCoolDown() {
    if (this.coolDown && this.coolDownText) {
      this.coolDown -= 1;
      let hour = Math.floor(this.coolDown / 3600);
      let minute = Math.floor((this.coolDown - hour * 3600) / 60);
      let seconds = Math.floor(this.coolDown - hour * 3600 - minute * 60);
      this.coolDownText.string = `${this.formatNumber(
        hour
      )}:${this.formatNumber(minute)}:${this.formatNumber(seconds)}`;
    }
  }

  formatNumber(val: number) {
    if (val < 10) return `0${val}`;
    return `${val}`;
  }
}
