import { _decorator, Component, EditBox, Label, Node } from "cc";
import { G } from "../G";
import { CustomerInfo } from "../shared/GameInterface";
import api from "../shared/API";
const { ccclass, property } = _decorator;

@ccclass("SceneUserInfo")
export class SceneUserInfo extends Component {
  @property({ type: EditBox })
  inputAddress: EditBox;
  @property({ type: Label })
  aptEarnedLabel: Label;
  @property({ type: Label })
  egonEarnedLabel: Label;

  async start() {
    if (!G.gameRoot) return;
    G.gameRoot.hideAllDialog();

    if (!G.dataStore) {
      return;
    }
    G.dataStore.customerInfo$.subscribe((customerInfo: CustomerInfo) => {
      if (customerInfo && this.inputAddress) {
        this.inputAddress.string = `${customerInfo.wallet_address ?? ""}`;
        this.aptEarnedLabel.string = `${customerInfo.apt_earned ?? 0}`;
        this.egonEarnedLabel.string = `${customerInfo.egon_earned ?? 0}`;
      }
    });
    await G.dataStore.refreshCustomerInfo();
  }

  async onEditWallet() {
    try {
      const { customerInfo } = await api.setWalletAddress(
        this.inputAddress.string
      );
      G.dataStore.customerInfo$.next(customerInfo);
    } catch (e) {
      this.inputAddress.string = `${
        G.dataStore.customerInfo$.value.wallet_address ?? ""
      }`;
    }
  }

  openContactTele() {
    window.open(G.dataStore.config$.value.contactTele, "_blank");
  }
  openContactX() {
    window.open(G.dataStore.config$.value.contactX, "_blank");
  }
}
