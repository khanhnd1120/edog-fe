import { _decorator, Component, Label, Node } from "cc";
import { G } from "../G";
import { CustomerInfo, DialogType } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("DialogInstruct1")
export class DialogInstruct1 extends Component {
  @property({ type: Label })
  energyLabel: Label;
  start() {
    this.node.active = true;
    G.dataStore.customerInfo$.subscribe((customerInfo: CustomerInfo) => {
      if (customerInfo) {
        this.energyLabel.string = `${customerInfo.energy}/${
          G.dataStore.config$.value.fishingEnergyFee ?? ""
        }`;
      }
    });
  }
  moveToInstruct2() {
    // G.gameRoot.showDialog(DialogType.Instruct2);
    if (
      G.dataStore.customerInfo$ &&
      G.dataStore.customerInfo$.value &&
      G.dataStore.customerInfo$.value.energy >=
        G.dataStore.config$.value.fishingEnergyFee
    ) {
      G.gameRoot.hideDialog(DialogType.Instruct1);
      G.enterGame();
    }
  }
}
