export type LevelId = "1966" | "1976" | "1986" | "1996" | "2006" | "2016" | "2026" | "golden";

export type PrizeTier = "15" | "20" | "25" | "30" | "35" | "40" | "50" | "golden";

export type ShoeKind =
  | "classic"
  | "wallabee"
  | "leather"
  | "sixty"
  | "desert"
  | "stamp"
  | "wheat"
  | "tan"
  | "cocoa"
  | "black"
  | "gold";

export type LevelDef = {
  id: LevelId;
  year: string;
  title: string;
  blurb: string;
  background: string;
  backgrounds: string[];
  card: string;
  hops: number;
  lives: number;
  baseGap: number;
  gapScale: number;
  baseWidth: number;
  widthShrink: number;
  minWidth: number;
  moveAmp: number;
  moveSpeed: number;
  wind: number;
  oscillate: boolean;
  hidePreviewAfter: number;
  oscSpeed: number;
  sweetPad: number;
  chargeRate: number;
  landInset: number;
  shoeKinds: ShoeKind[];
  prizeHint: string;
};

export type Shoe = {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: ShoeKind;
  phase: number;
  baseX: number;
  moveAmp: number;
  moveSpeed: number;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
};

export type PlayMode = "ready" | "charging" | "flight" | "celebrate" | "fallen" | "won" | "lost";

export type HudSnap = {
  mode: PlayMode;
  hop: number;
  total: number;
  lives: number;
  score: number;
  perfects: number;
  charge: number;
  sweetLo: number;
  sweetHi: number;
  message: string;
  elapsed: number;
};

export type RunResult = {
  levelId: LevelId;
  won: boolean;
  hops: number;
  total: number;
  score: number;
  perfects: number;
  elapsedMs: number;
};

export type Progress = {
  decades: LevelId[];
  currentStage: LevelId;
  stakePercent: number;
  cashedPercent: number;
  cashedOut: boolean;
  pendingDecision: boolean;
  goldenBest: number;
  goldenDone: boolean;
  bestScore: number;
};
