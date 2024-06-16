import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { G } from '../G';
const { ccclass, property } = _decorator;

@ccclass('SceneLeaderboard')
export class SceneLeaderboard extends Component {
    @property({ type: Prefab })
    leaderboardItem: Prefab;
    @property({ type: Node })
    leaderboardContent: Node

    start() {
        if (!G.gameRoot) return;
        G.gameRoot.hideAllDialog();
    }

    update(deltaTime: number) {

    }
}


