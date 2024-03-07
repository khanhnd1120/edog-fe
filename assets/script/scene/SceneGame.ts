import {
  _decorator,
  Component,
  Node,
  director,
  Director,
  view,
  Canvas,
  UITransform,
  Prefab,
  instantiate,
  Vec3,
  SpriteFrame,
  Sprite,
  input,
  Input,
  KeyCode,
} from "cc";
import { G } from "../G";
import { LayerAnimation } from "../components/LayerAnimation";
import { Direction } from "../shared/GameInterface";
import { ColyseusManager } from "../../Libs/ColyseusManager";
const { ccclass, property } = _decorator;

@ccclass("SceneGame")
export class SceneGame extends Component {
  @property({ type: Canvas })
  canvas: Canvas;
  @property({ type: Node })
  topLeft: Node;
  @property({ type: Node })
  bottomRight: Node;
  @property({ type: [Prefab] })
  backgroundLayers: Prefab[] = [];
  @property({ type: Node })
  gamePanel: Node;
  @property({ type: Node })
  sky: Node;
  @property({ type: Prefab })
  playerPrefab: Prefab;
  @property({ type: Prefab })
  hookPrefab: Prefab;
  @property({ type: Prefab })
  fishPrefab: Prefab;
  @property({ type: [SpriteFrame] })
  fishSpriteFrames: SpriteFrame[] = [];
  fishes: {
    [key: number]: {
      node: Node;
      id: number;
      serverObject: any;
    };
  };

  start() {
    G.sceneWidth = this.bottomRight.position.x - this.topLeft.position.x;
    G.sceneHeight = this.bottomRight.position.y - this.topLeft.position.y;
    G.unit = G.sceneWidth / G.config.getConfigData().MapWidth;
    this.fishes = {};
    ColyseusManager.Instance().OnJoinGame(() => {
      this.renderMap();
      this.renderPlayer();
      this.renderHook();
      this.renderFish();
      input.on(Input.EventType.KEY_DOWN, (event) => {
        switch (event.keyCode) {
          case KeyCode.SPACE:
            ColyseusManager.Instance().getServerObject().send("on-tap", true);
            break;
        }
      });
    });
  }

  renderFish() {
    const serverObject =
      ColyseusManager.Instance().getServerObject().state.fishes;
    serverObject.onAdd((fishData: any) => {
      if (!this.fishes[fishData.uid]) {
        const fish = instantiate(this.fishPrefab);
        fish.getComponent(Sprite).spriteFrame =
          this.fishSpriteFrames[fishData.id];
        const { x: newX, y: newY } = G.convertPosition({
          x: fishData.pos.x,
          y: fishData.pos.y,
        });

        fish.setPosition(newX, newY);
        this.gamePanel.addChild(fish);
        this.fishes[fishData.uid] = {
          node: fish,
          id: fishData.id,
          serverObject: fishData,
        };
        fishData.listen("pos", ({ x, y }: { x: number; y: number }) => {
          const { x: newX, y: newY } = G.convertPosition({ x, y });
          fish.setPosition(newX, newY);
        });
      }
    });
  }
  renderPlayer() {
    const player = instantiate(this.playerPrefab);
    this.gamePanel.addChild(player);
    const serverObject =
      ColyseusManager.Instance().getServerObject().state.hook;
    if (serverObject) {
      serverObject.listen("center", ({ x, y }: { x: number; y: number }) => {
        const { x: newX, y: newY } = G.convertPosition({ x, y });
        player.setPosition(newX, newY);
      });
    }
  }
  renderHook() {
    const hook = instantiate(this.hookPrefab);
    this.gamePanel.addChild(hook);
    const serverObject =
      ColyseusManager.Instance().getServerObject().state.hook;
    if (serverObject) {
      serverObject.listen("pos", ({ x, y }: { x: number; y: number }) => {
        const { x: newX, y: newY } = G.convertPosition({ x, y });
        hook.setPosition(newX, newY);
      });
    }
  }
  renderMap() {
    this.sky.getComponent(UITransform).height = G.unit * 24;
    for (let i = 0; i < G.config.getConfigData().NumberLayer; i++) {
      this.backgroundLayers.map((item, indexLayer) => {
        const speed = Math.random() * 10 + 4 * i;
        for (let j = 0; j < 3; j++) {
          const backgroundLayer = instantiate(item);
          backgroundLayer.getComponent(LayerAnimation).init({
            width: G.sceneWidth + 100,
            height: 3 * G.unit - 30,
            x: -j * G.sceneWidth,
            y: -G.unit * (3 * i + 1.5) - 15,
            direction: [Direction.Left, Direction.Right][indexLayer % 2],
            speed,
          });
          this.gamePanel.addChild(backgroundLayer);
        }
      });
    }
  }
}
