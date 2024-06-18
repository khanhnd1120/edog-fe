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
        this.userId.string = `UserID: ${customerInfo.user_name}`;
        this.highScore.string = `HIGHSCORE:      ${customerInfo.highest_score}`;
      }
    });
  }

  onBtnShowInfoClick() {
    director.loadScene("userinfo");
    this.navbar.toggle(-1);
  }
}
