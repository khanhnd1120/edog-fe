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
  ClaimQuest,
  SetWallet,
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
  twitter_username: string;
  first_name: string;
  last_name: string;
  highest_score: number;
  high_score_day: number;
  wallet_address: string;
  apt_earned: number;
  egon_earned: number;
  invite_link: string;
  apt_referral_earned: number;
  egon_referral_earned: number;
  energy: number;
}

export interface DailyQuestInfo {}

export interface ConfigInfo {
  contactTele: string;
  contactX: string;
  rule: string;
  exploreMore: string;
  fishingEnergyFee: number;
}

export enum DailyQuestType {
  Referral,
  VisitLink,
  Retweet,
  CommentTwitter,
  QuoteTweet,
  InstantTweet,
}

export enum MessageIframeType {
  LoadGameSuccess = "LoadGameSuccess",
  FishingToken = "FishingToken",
  UpdateCustomer = "UpdateCustomer",
}
