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
  CatchedEGON,
}

export interface CustomerInfo {
  id: number;
  telegram_id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  highest_score: number;
  high_score_day: number;
  wallet_address: string;
  apt_earned: number;
  egon_earned: number;
}

export interface DailyQuestInfo {}

export interface ConfigInfo {
  contactTele: string;
  contactX: string;
}

export enum DailyQuestType {
  Referral,
  VisitLink,
}
