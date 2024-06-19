import { _decorator, Component, director, Label, Node } from "cc";
import { G } from "../G";
import { CustomerInfo } from "../shared/GameInterface";
import { TabManager } from "./TabManager";
const { ccclass, property } = _decorator;

@ccclass("Header")
export class Header extends Component {
  @property({ type: Label })
  userId: Label;
  @property({ type: Label })
  highScore: Label;
  @property({ type: TabManager })
  navbar: TabManager;

  start() {
    if (!G.dataStore) {
      return;
    }
    G.dataStore.customerInfo$.subscribe((customerInfo: CustomerInfo) => {
      if (customerInfo) {
        let name = customerInfo.user_name;
        if (!name) {
          name = customerInfo.first_name + " " + customerInfo.last_name;
        }
        if (!name) {
          name = customerInfo.telegram_id;
        }
        this.userId.string = `UserID: ${name}`;
        this.highScore.string = `HIGHSCORE:      ${customerInfo.highest_score}`;
      }
    });
  }

  onBtnShowInfoClick() {
    if (G.isPlaying) return;
    director.loadScene("userinfo");
    this.navbar.toggle(-1);
  }
}
