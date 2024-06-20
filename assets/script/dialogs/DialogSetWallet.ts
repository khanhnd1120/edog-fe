import { _decorator, Component, EditBox, Node } from "cc";
import api from "../shared/API";
import { G } from "../G";
import { DialogType } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("DialogSetWallet")
export class DialogSetWallet extends Component {
  @property({ type: EditBox })
  inputAddress: EditBox;

  start() {
    this.inputAddress.string = `${
      G.dataStore.customerInfo$.value.wallet_address ?? "Enter Wallet Here..."
    }`;
  }
  async onEditWallet() {
    try {
      if (!this.inputAddress.string) {
        G.gameRoot.hideDialog(DialogType.SetWallet);
        return;
      }
      const { customerInfo } = await api.setWalletAddress(
        this.inputAddress.string
      );
      G.dataStore.customerInfo$.next(customerInfo);
      G.gameRoot.hideDialog(DialogType.SetWallet);
    } catch (e) {
      this.inputAddress.string = `${
        G.dataStore.customerInfo$.value.wallet_address ?? "Enter Wallet Here..."
      }`;
      G.gameRoot.hideDialog(DialogType.SetWallet);
    }
  }
}
