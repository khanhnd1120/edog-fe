import { _decorator, Component, Node } from 'cc';
import { G } from '../G';
const { ccclass, property } = _decorator;

@ccclass('SceneQuest')
export class SceneQuest extends Component {
    start() {
        if (!G.gameRoot) return;
        G.gameRoot.hideAllDialog();
    }

    update(deltaTime: number) {

    }
}


