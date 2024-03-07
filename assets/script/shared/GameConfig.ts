import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

interface ConfigData {
  NumberLayer: number;
  MapWidth: number;
  GameConfig: number[];
}

@ccclass("GameConfig")
export class GameConfig extends Component {
  public static readonly Instance: GameConfig = new GameConfig();
  private data: ConfigData = null;

  setConfigData(newData: any) {
    this.data = newData;
  }
  getConfigData() {
    return this.data;
  }
}
