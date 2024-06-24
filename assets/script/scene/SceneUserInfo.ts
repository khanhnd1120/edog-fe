import { _decorator, Component, EditBox, Label, Node } from "cc";
import { G } from "../G";
import { CustomerInfo, DialogType } from "../shared/GameInterface";
import api from "../shared/API";
const { ccclass, property } = _decorator;

@ccclass("SceneUserInfo")
export class SceneUserInfo extends Component {
  @property({ type: Label })
  addressLabel: Label;
  @property({ type: Label })
  aptEarnedLabel: Label;
  @property({ type: Label })
  egonEarnedLabel: Label;
  @property({ type: Label })
  aptCommissionLabel: Label;
  @property({ type: Label })
  egonCommissionLabel: Label;

  async start() {
    if (!G.gameRoot) return;
    G.gameRoot.hideAllDialog();

    if (!G.dataStore) {
      return;
    }
    G.dataStore.customerInfo$.subscribe((customerInfo: CustomerInfo) => {
      if (customerInfo && this.addressLabel) {
        this.addressLabel.string = `${
          customerInfo.wallet_address ?? "Enter Wallet Here..."
        }`;
        this.aptEarnedLabel.string = `${customerInfo.apt_earned ?? 0}`;
        this.egonEarnedLabel.string = `${customerInfo.egon_earned ?? 0}`;
        this.aptCommissionLabel.string = `${customerInfo.apt_referral_earned}`;
        this.egonCommissionLabel.string = `${customerInfo.egon_referral_earned}`;
      }
    });
    await G.dataStore.refreshCustomerInfo();
  }

  async onEditWallet() {
    G.gameRoot.showDialog(DialogType.SetWallet);
  }

  openContactTele() {
    window.open(G.dataStore.config$.value.contactTele, "_blank");
  }
  openContactX() {
    window.open(G.dataStore.config$.value.contactX, "_blank");
  }
  openRule() {
    window.open(G.dataStore.config$.value.rule, "_blank");
  }
  openExploreMore() {
    window.open(G.dataStore.config$.value.exploreMore, "_blank");
  }
}
