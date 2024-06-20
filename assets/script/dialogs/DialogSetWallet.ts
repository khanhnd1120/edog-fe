import { _decorator, Component, EditBox, Node } from "cc";
import api from "../shared/API";
import { G } from "../G";
import { DialogType } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("DialogSetWallet")
export class DialogSetWallet extends Component {
  @property({ type: EditBox })
  inputAddress: EditBox;
  @property({ type: Node })
  errNode: Node;

  start() {
    this.inputAddress.string = `${
      G.dataStore.customerInfo$.value.wallet_address ?? "Enter Wallet Here..."
    }`;
    this.errNode.active = false;
  }
  async onEditWallet() {
    try {
      if (!this.inputAddress.string) {
        G.gameRoot.hideDialog(DialogType.SetWallet);
        return;
      }
      if (this.inputAddress.string.length < 64) {
        this.errNode.active = true;
        return;
      }
      this.errNode.active = false;
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
