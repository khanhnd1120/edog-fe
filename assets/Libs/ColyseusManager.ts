import {
  _decorator,
  CCBoolean,
  CCInteger,
  CCString,
  Component,
  error,
  log,
  Node,
  sys,
} from "cc";
const { ccclass, property } = _decorator;

import Colyseus from "db://colyseus-sdk/colyseus.js";
import { G } from "../script/G";
import { DataStore } from "../script/store/DataStore";

@ccclass("ColyseusManager")
export class ColyseusManager extends Component {
  //#region Instance
  private static instance: ColyseusManager;
  public static Instance(): ColyseusManager {
    if (!this.instance) {
      this.instance = new ColyseusManager();
    }

    return this.instance;
  }
  private isLoadConfig: boolean = false;

  public static Exist(): boolean {
    return this.instance != null;
  }
  //#endregion

  //#region Inspector
  @property({ type: CCInteger }) port: number = 2567;
  @property({ type: CCBoolean }) useSSL: boolean = false;

  client!: Colyseus.Client;
  lobby!: Colyseus.Room;
  game!: Colyseus.Room;
  //#endregion

  //#region Variables
  private TAG: string = "[ColyseusManager]: ";
  //#endregion

  //#region Cocos Methods

  protected onLoad(): void {
    ColyseusManager.instance = this;
  }
  start() {
    this.InitColyseus();
  }

  update(deltaTime: number) {}
  //#endregion

  //#region Lobby Methods
  public OnCreateNonce(callback: any) {
    if (this.lobby == null || this.lobby == undefined) {
      callback(null);
    } else {
      this.lobby.onMessage("create-nonce", (mess) => {
        callback(mess);
      });
      this.lobby.send("create-nonce");
    }
  }

  //#endregion

  //#region Game Methods
  public Close(): void {
    this.node.active = false;
    delete this.game;
  }

  public EndGame(): void {
    this.game.leave();
    this.Close();
  }

  public async OnJoinGame(callback: any) {
    const name = "gold-digger";
    log(`${this.TAG} JoinGame ${this.game}`);
    let searchParams = new URLSearchParams(window.location.search);
    let token = searchParams.get("token");
    try {
      this.game = await this.client.joinOrCreate(name, {
        token: token,
      });
      log(`join ${name} successfully!`);
      log("user's sessionId:", this.game.sessionId);
      callback(true, this.game);
    } catch (e) {
      callback(false);
      error(`${this.TAG}${e}`);
    }
  }

  public checkIsLoadConfig() {
    return this.isLoadConfig;
  }

  public getServerObject() {
    return this.game;
  }
  //#endregion

  //#region Colyseus Methods
  private InitColyseus(): void {
    let searchParams = new URLSearchParams(window.location.search);
    let serverUrl = searchParams.get("logic_server_url");
    this.client = new Colyseus.Client(
      `${this.useSSL ? "wss" : "ws"}://${serverUrl
        .replace("https://", "")
        .replace("http://", "")}${
        [443, 80].includes(this.port) || this.useSSL ? "" : `:${this.port}`
      }`
    );
    G.backendHost = `${serverUrl}${
      [443, 80].includes(this.port) || this.useSSL ? "" : `:${this.port}`
    }`;

    // Connect into the lobby
    this.Connect();
  }

  private async Connect() {
    log(`${this.TAG} Connect`);
    try {
      this.lobby = await this.client.joinOrCreate("lobby");
      log("joined Lobby successfully!");
      //log("user's sessionId:", this.lobby.sessionId);
      this.GetConfigs();
      this.lobby.onStateChange((state) => {
        log("onStateChange: ", JSON.stringify(state));
      });

      this.lobby.onLeave((code) => {
        log("onLeave:", code);
      });
      await G.dataStore.refreshCustomerInfo();
      await G.dataStore.refreshConfigInfo();
    } catch (e) {
      error(`${this.TAG}${e}`);
    }
  }
  //#endregion

  //#region  Private Methods
  private GetConfigs() {
    this.lobby.onMessage("get-config", (mess) => {
      G.config.setConfigData(mess);
      this.isLoadConfig = true;
    });
    this.lobby.send("get-config");
  }
  //#endregion
}
