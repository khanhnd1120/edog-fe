/** @format */

import { director, sys } from "cc";
import { GameRoot } from "./shared/GameRoot";
import { GameConfig } from "./shared/GameConfig";
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
  public unit: number;
  private constructor() {}
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
  public enterAuth() {
    director.loadScene("auth");
  }
  public convertPosition({ x, y }: { x: number; y: number }) {
    return {
      x: x * this.unit - 16 * this.unit,
      y: y * this.unit - 12 * this.unit,
    };
  }
}
export const G = GlobalInstance.Instance;
