import { _decorator, Component, director, Label, Node } from "cc";
import { G } from "../G";
import { CustomerInfo, DialogType } from "../shared/GameInterface";
import { TabManager } from "./TabManager";
const { ccclass, property } = _decorator;

@ccclass("Header")
export class Header extends Component {
  @property({ type: Label })
  userId: Label;
  @property({ type: Label })
  aptosWalletAddress: Label;
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
        this.highScore.string = `HIGHSCORE:      ${customerInfo.high_score_day}`;
        this.aptosWalletAddress.string = `${
          customerInfo.wallet_address
            ? `APTOS Wallet: ${customerInfo.wallet_address.slice(
                0,
                6
              )}...${customerInfo.wallet_address.slice(-8)}`
            : "Enter Wallet Here..."
        }`;
      }
    });
  }

  onBtnShowInfoClick() {
    if (G.isPlaying) return;
    director.loadScene("userinfo");
    this.navbar.toggle(-1);
  }

  async onEditWallet() {
    G.gameRoot.showDialog(DialogType.SetWallet);
  }
}
