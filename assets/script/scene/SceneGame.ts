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
  Sprite,
  ProgressBar,
  UIOpacity,
  AudioSource,
} from "cc";
import { G } from "../G";
import { DialogType, GameConfigKey, GameState } from "../shared/GameInterface";
import { ColyseusManager } from "../../Libs/ColyseusManager";
import { Fish } from "../components/Fish";
import { Hook } from "../components/Hook";
import { DialogEndGame } from "../dialogs/DialogEndGame";
const { ccclass, property } = _decorator;

@ccclass("SceneGame")
export class SceneGame extends Component {
  @property({ type: Canvas })
  canvas: Canvas;
  @property({ type: Node })
  topLeft: Node;
  @property({ type: Node })
  bottomRight: Node;
  @property({ type: Node })
  gamePanel: Node;
  @property({ type: Node })
  timerIcon: Node;
  @property({ type: Prefab })
  playerPrefab: Prefab;
  @property({ type: Prefab })
  hookPrefab: Prefab;
  @property({ type: Prefab })
  fishPrefab: Prefab;
  @property({ type: Label })
  scoreLabel: Label;
  @property({ type: Label })
  totalScoreLabel: Label;
  @property({ type: Label })
  countdownLabel: Label;
  @property({ type: Node })
  countdown: Node;
  @property({ type: Label })
  requireScoreLabel: Label;
  @property({ type: Node })
  leftWall: Node;
  @property({ type: Node })
  rightWall: Node;
  @property({ type: Node })
  line: Node;
  @property({ type: [Node] })
  backgrounds: Node[] = [];
  @property({ type: [SpriteFrame] })
  iconTimers: SpriteFrame[] = [];
  @property({ type: Prefab })
  bubbles: Prefab;
  @property({ type: Node })
  timerCounter: Node;
  @property({ type: AudioSource })
  scoreSmallSfx: AudioSource;
  @property({ type: AudioSource })
  scoreBigSfx: AudioSource;
  @property({ type: Label })
  stageLabel: Label;

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
    if (G.config.getConfigData().MapHeight * G.unit > G.sceneHeight) {
      G.unit = G.sceneHeight / G.config.getConfigData().MapHeight;
      G.sceneWidth = G.unit * G.config.getConfigData().MapWidth;
      const wallWidth = realWidth - G.sceneHeight;
      this.leftWall.getComponent(UITransform).width = wallWidth;
      this.leftWall.setPosition(new Vec3(-G.sceneWidth / 2 - wallWidth / 2, 0));

      this.rightWall.getComponent(UITransform).width = wallWidth;
      this.rightWall.setPosition(new Vec3(G.sceneWidth / 2 + wallWidth / 2, 0));
    }
    this.fishes = {};
    this.countdown.active = true;
    this.timerCounter.getComponent(ProgressBar).progress = 0;
    this.backgrounds.map((bg) => {
      bg.getComponent(UITransform).width = G.sceneWidth;
      bg.getComponent(UITransform).height = G.sceneHeight;
      bg.getComponent(UIOpacity).opacity = 0;
    });
    ColyseusManager.Instance().OnJoinGame(() => {
      this.renderUI();
    });
    this.renderBubbles();
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
      serverObject.listen("stage", (stage: number) => {
        this.stageLabel.string = `Day ${stage}`;
      });
      serverObject.listen("gameState", (gameState: GameState) => {
        switch (gameState) {
          case GameState.GameOver:
            G.gameRoot.showDialog(DialogType.DialogEndGame);
            break;
        }
      });
      serverObject.listen("remainTime", (remainTime: number) => {
        this.onChangeRemainTime(remainTime);
      });
      serverObject.listen("requireScore", (requireScore: number) => {
        this.requireScoreLabel.string = `Target: ${requireScore}`;
      });
      serverObject.listen("startGame", (startGame: number) => {
        if (!startGame) {
          this.countdownLabel.string = "Loading...";
        }
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
      if (this.fishes[fishData.uid]) {
        const layer = this.fishes[fishData.uid].serverObject.layer;
        if (layer < 2) {
          this.scoreSmallSfx.play();
        } else {
          this.scoreBigSfx.play();
        }
      }
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
        this.scoreLabel.string = `Current: ${score}`;
      });
      serverObject.listen("totalScore", (score: number) => {
        this.totalScoreLabel.string = `Total earned: ${score}`;
        G.gameRoot.dialogNodes[DialogType.DialogEndGame]
          .getComponent(DialogEndGame)
          .init(`${score}`);
      });
    }
  }
  onChangeRemainTime(time: number) {
    const stageTime =
      G.config.getConfigData().GameConfig[GameConfigKey.StageTime];
    const countBackground = this.backgrounds.length;
    let backgroundIndex = Math.floor(time / (stageTime / countBackground));
    if (backgroundIndex < 0) {
      backgroundIndex = 0;
    }
    if (backgroundIndex >= countBackground) {
      backgroundIndex = countBackground - 1;
    }
    let nextBg = backgroundIndex - 1;
    if (nextBg < 0) {
      nextBg = countBackground - 1;
    }
    const nextBgOpactity =
      ((stageTime -
        (countBackground - 1 - backgroundIndex) *
          (stageTime / countBackground) -
        time) /
        (stageTime / countBackground)) *
      255;
    this.backgrounds[backgroundIndex].getComponent(UIOpacity).opacity =
      255 - nextBgOpactity;
    this.backgrounds[nextBg].getComponent(UIOpacity).opacity = nextBgOpactity;

    const countTimerIcon = this.iconTimers.length;
    let timerIndex = Math.floor(time / (stageTime / countTimerIcon));
    if (timerIndex < 0) {
      timerIndex = 0;
    }
    if (timerIndex >= countTimerIcon) {
      timerIndex = countTimerIcon - 1;
    }
    if (
      this.timerIcon.getComponent(Sprite).spriteFrame.name !=
      this.iconTimers[timerIndex].name
    ) {
      this.timerIcon.getComponent(Sprite).spriteFrame =
        this.iconTimers[timerIndex];
    }

    const percentTimeRemain = time / stageTime;
    this.timerCounter.getComponent(ProgressBar).progress =
      1 - percentTimeRemain;
  }
  renderMap() {
    this.backgrounds.map((bg) => {
      bg.getComponent(UITransform).height =
        G.unit * G.config.getConfigData().MapHeight;
      bg.getComponent(UITransform).width =
        G.unit * G.config.getConfigData().MapWidth;
    });

    this.leftWall.active = true;
    this.rightWall.active = true;
  }
  renderBubbles() {
    for (let i = 0; i < 20; i++) {
      const newBubble = instantiate(this.bubbles);
      newBubble.setPosition(
        new Vec3(
          G.getRndInteger(
            (-G.config.getConfigData().MapWidth * G.unit) / 2,
            (G.config.getConfigData().MapWidth * G.unit) / 2
          ),
          G.getRndInteger(
            (-G.config.getConfigData().MapHeight * G.unit) / 2,
            (-G.config.getConfigData().MapHeight * G.unit) / 2 +
              (G.config.getConfigData().NumberLayer + 2) * G.unit
          )
        )
      );
      this.gamePanel.addChild(newBubble);
    }
  }
}
