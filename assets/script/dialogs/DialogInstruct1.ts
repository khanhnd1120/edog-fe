import { _decorator, Component, Node } from 'cc';
import { G } from '../G';
import { DialogType } from '../shared/GameInterface';
const { ccclass, property } = _decorator;

@ccclass('DialogInstruct1')
export class DialogInstruct1 extends Component {
    start() {
        this.node.active = true;
    }
    moveToInstruct2() {
        // G.gameRoot.showDialog(DialogType.Instruct2);
        G.gameRoot.hideDialog(DialogType.Instruct1);
        G.enterGame();
    }
    openGameRule() {
        window.open(G.dataStore.config$.value.rule, "_blank");
    }
}


