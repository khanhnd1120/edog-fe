import {
  _decorator,
  Component,
  Node,
  Canvas,
  UITransform,
  Prefab,
  instantiate,
  Vec3,
  SpriteFrame,
  input,
  Input,
  KeyCode,
  Label,
  Graphics,
  Color,
} from "cc";
import { G } from "../G";
import { LayerAnimation } from "../components/LayerAnimation";
import { DialogType, Direction, GameState } from "../shared/GameInterface";
import { ColyseusManager } from "../../Libs/ColyseusManager";
import { Fish } from "../components/Fish";
import { Hook } from "../components/Hook";
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
  @property({ type: Label })
  stage: Label;
  @property({ type: Label })
  scoreLabel: Label;
  @property({ type: Label })
  countdownLabel: Label;
  @property({ type: Node })
  countdown: Node;
  @property({ type: Label })
  timerLabel: Label;
  @property({ type: Label })
  requireScoreLabel: Label;
  @property({ type: Node })
  leftWall: Node;
  @property({ type: Node })
  rightWall: Node;
  @property({ type: [Node] })
  trees: Node[] = [];
  @property({ type: Node })
  line: Node;

  score: number;
  player: Node;
  hook: Node;
  fishes: {
    [key: number]: {
      node: Node;
      id: number;
      serverObject: any;
    };
  };

  start() {
    const realWidth = this.bottomRight.position.x - this.topLeft.position.x;
    G.sceneWidth = realWidth;
    G.sceneHeight = this.topLeft.position.y - this.bottomRight.position.y;
    G.unit = G.sceneWidth / G.config.getConfigData().MapWidth;
    if (24 * G.unit > G.sceneHeight) {
      G.unit = G.sceneHeight / 24;
      G.sceneWidth = G.unit * G.config.getConfigData().MapWidth;
      const wallWidth = realWidth - G.sceneHeight;
      this.leftWall.getComponent(UITransform).width = wallWidth;
      this.leftWall.setPosition(
        new Vec3(-G.sceneWidth / 2 - wallWidth / 2, -G.sceneHeight / 2)
      );

      this.rightWall.getComponent(UITransform).width = wallWidth;
      this.rightWall.setPosition(
        new Vec3(G.sceneWidth / 2 + wallWidth / 2, -G.sceneHeight / 2)
      );

      this.sky.getComponent(UITransform).width = realWidth;
      this.trees.map((tree, index) => {
        tree.getComponent(UITransform).width = realWidth / 3;
        tree.setPosition(new Vec3((index * realWidth) / 3 - realWidth / 3));
      });
    }
    this.fishes = {};
    this.countdown.active = true;
    ColyseusManager.Instance().OnJoinGame(() => {
      this.renderUI();
    });
  }

  update(dt: number) {
    if (this.player && this.hook) {
      const drawing = this.line.getComponent(Graphics);
      drawing.clear();
      drawing.lineWidth = 4;
      drawing.moveTo(this.player.position.x, this.player.position.y);
      drawing.lineTo(this.hook.position.x, this.hook.position.y);
      drawing.stroke();
    }
  }

  renderUI() {
    const serverObject = ColyseusManager.Instance().getServerObject().state;
    if (serverObject) {
      serverObject.listen("gameState", (gameState: GameState) => {
        switch (gameState) {
          case GameState.GameOver:
            G.gameRoot.showDialog(DialogType.DialogEndGame);
            break;
        }
      });
      serverObject.listen("stage", (stage: number) => {
        this.stage.string = `Stage: ${stage}`;
      });
      serverObject.listen("remainTime", (remainTime: number) => {
        this.timerLabel.string = Math.ceil(remainTime).toString();
      });
      serverObject.listen("requireScore", (requireScore: number) => {
        this.requireScoreLabel.string = `Require Score: ${requireScore}`;
      });
      serverObject.listen("countDownTime", (countDownTime: number) => {
        this.countdownLabel.string = Math.ceil(countDownTime).toString();
        if (countDownTime < 0) {
          this.countdown.active = false;
          this.renderMap();
          this.renderPlayer();
          this.renderHook();
          this.renderFish();
          input.on(Input.EventType.KEY_DOWN, (event) => {
            switch (event.keyCode) {
              case KeyCode.SPACE:
                ColyseusManager.Instance()
                  .getServerObject()
                  .send("on-tap", true);
                break;
            }
          });
        }
      });
    }
  }
  renderFish() {
    const serverObject =
      ColyseusManager.Instance().getServerObject().state.fishes;
    serverObject.onAdd((fishData: any) => {
      if (!this.fishes[fishData.uid]) {
        const fish = instantiate(this.fishPrefab);
        const { x: newX, y: newY } = G.convertPosition({
          x: fishData.pos.x,
          y: fishData.pos.y,
        });
        fish.getComponent(Fish).init({
          id: fishData.id,
          direction: fishData.direction,
          x: newX,
          y: newY,
          width: fishData.size * G.unit,
          height: 3 * G.unit,
          serverObject: fishData,
        });
        this.gamePanel.addChild(fish);
        this.fishes[fishData.uid] = {
          node: fish,
          id: fishData.id,
          serverObject: fishData,
        };
      }
    });

    serverObject.onRemove((fishData: any) => {
      this.fishes[fishData.uid].node.destroy();
      delete this.fishes[fishData.uid];
    });
  }
  renderPlayer() {
    const player = instantiate(this.playerPrefab);
    this.gamePanel.addChild(player);
    this.player = player;
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
    const serverObject =
      ColyseusManager.Instance().getServerObject().state.hook;
    const hook = instantiate(this.hookPrefab);
    hook.getComponent(Hook).init({
      serverObject,
    });
    this.gamePanel.addChild(hook);
    this.hook = hook;
    if (serverObject) {
      serverObject.listen("score", (score: number) => {
        this.scoreLabel.string = `Score: ${score}`;
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
            height: i == 0 ? 3 * G.unit : 3 * G.unit - 30,
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
