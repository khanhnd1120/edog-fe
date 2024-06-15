export enum GameConfigKey {
  BaseScore,
  ScaleRate,
  StageTime,
  ResetStage,
  ScaleSpdMin,
  ScaleSpdMax,
  ScaleSpdRate,
  BaseHookSpeed,
  HookAngle,
}

export enum Direction {
  Left,
  Right,
}

export enum DialogType {
  DialogEndGame,
  Instruct1,
  Instruct2,
}

export enum GameState {
  Prepare,
  Pending,
  GameOver,
}

export enum NewsType {
  HighScore,
  EarnAPT,
  CatchedAPT,
  CatchedEGON
}