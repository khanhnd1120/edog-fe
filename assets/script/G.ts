/** @format */

import { director, sys } from "cc";
import { GameRoot } from "./shared/GameRoot";
import { GameConfig } from "./shared/GameConfig";
import { FeatUIPosition } from "./components/FeatUIPosition";
import { DataStore } from "./store/DataStore";
export interface SettingData {
  music: number;
  sfx: number;
}

class GlobalInstance {
  public static readonly Instance: GlobalInstance = new GlobalInstance();
  public gameRoot: GameRoot = null;
  public config: GameConfig = new GameConfig();
  public sceneWidth: number;
  public sceneHeight: number;
  public screenWidth: number;
  public screenHeight: number;
  public unit: number;
  public FeatUIComponents: FeatUIPosition[];
  public backendHost: string;
  public dataStore: DataStore = new DataStore();
  public isPlaying: boolean = true;

  private constructor() {
    this.FeatUIComponents = [];
  }
  setSetting(data: any) {
    let old = this.getSetting();
    sys.localStorage.setItem(
      "setting",
      JSON.stringify(Object.assign(old, data))
    );
  }
  getSetting() {
    let settingRaw = sys.localStorage.getItem("setting");
    let data = { music: 1, sfx: 1 };
    try {
      if (settingRaw) {
        data = JSON.parse(settingRaw);
      }
    } finally {
      return data;
    }
  }
  public enterHall() {
    director.loadScene("hall");
  }
  public enterGame() {
    director.loadScene("game");
  }
  public convertPosition({ x, y }: { x: number; y: number }) {
    return {
      x: x * this.unit - (this.config.getConfigData().MapWidth / 2) * this.unit,
      y:
        y * this.unit - (this.config.getConfigData().MapHeight / 2) * this.unit,
    };
  }
  public getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
export const G = GlobalInstance.Instance;
