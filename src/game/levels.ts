import type { LevelDef, LevelId, PrizeTier } from "./types";

export const DECADE_IDS: Exclude<LevelId, "golden">[] = ["1966", "1976", "1986", "1996", "2006", "2016", "2026"];

const GREATBRAK = "/assets/bg-greatbrak.jpg";
const SCHOOLYARD = "/assets/bg-schoolyard.jpg";
const WOODSTOCK = "/assets/bg-woodstock.jpg";
const WORKSHOPS = "/assets/bg-workshops.jpg";
const LONGSTREET = "/assets/bg-longstreet.jpg";
const TABLEMTN = "/assets/bg-tablemountain.jpg";
const WATERFRONT = "/assets/bg-waterfront.jpg";
const BLOUBERG = "/assets/bg-blouberg.jpg";

export type LadderStep = {
  percent: number;
  nextPercent: number | "pair";
  next: LevelId;
};

/** Cash-out % for clearing this decade, and what you risk it for. */
export const LADDER: Record<Exclude<LevelId, "golden">, LadderStep> = {
  "1966": { percent: 15, nextPercent: 20, next: "1976" },
  "1976": { percent: 20, nextPercent: 25, next: "1986" },
  "1986": { percent: 25, nextPercent: 30, next: "1996" },
  "1996": { percent: 30, nextPercent: 35, next: "2006" },
  "2006": { percent: 35, nextPercent: 40, next: "2016" },
  "2016": { percent: 40, nextPercent: 50, next: "2026" },
  "2026": { percent: 50, nextPercent: "pair", next: "golden" },
};

export function ladderOf(id: LevelId): LadderStep | null {
  if (id === "golden") return null;
  return LADDER[id];
}

export function tierFromPercent(n: number): PrizeTier | null {
  if (n === 15 || n === 20 || n === 25 || n === 30 || n === 35 || n === 40 || n === 50) return String(n) as PrizeTier;
  return null;
}

export const LEVELS: Record<LevelId, LevelDef> = {
  "1966": {
    id: "1966",
    year: "1966",
    title: "The First Pair",
    blurb: "Great Brak River, Garden Route. Lagoon, leather, last — the first comfortable step.",
    background: GREATBRAK,
    backgrounds: [GREATBRAK],
    card: "/assets/card-greatbrak.jpg",
    hops: 24,
    lives: 3,
    baseGap: 236,
    gapScale: 10,
    baseWidth: 188,
    widthShrink: 2.6,
    minWidth: 132,
    moveAmp: 0,
    moveSpeed: 0,
    wind: 0,
    oscillate: false,
    hidePreviewAfter: 5,
    oscSpeed: 1.2,
    sweetPad: 0.04,
    chargeRate: 1.12,
    landInset: 0.2,
    shoeKinds: ["classic"],
    prizeHint: "Clear 1966 for 15% off. Cash out — or risk it for 20%.",
  },
  "1976": {
    id: "1976",
    year: "1976",
    title: "Schoolyard Classic",
    blurb: "A dusty SA schoolyard. Facebrick, crepe soles, and a pair that outlasted every term.",
    background: SCHOOLYARD,
    backgrounds: [SCHOOLYARD],
    card: "/assets/card-schoolyard.jpg",
    hops: 26,
    lives: 3,
    baseGap: 252,
    gapScale: 11,
    baseWidth: 174,
    widthShrink: 2.9,
    minWidth: 114,
    moveAmp: 8,
    moveSpeed: 0.55,
    wind: 16,
    oscillate: false,
    hidePreviewAfter: 4,
    oscSpeed: 1.3,
    sweetPad: 0.032,
    chargeRate: 1.18,
    landInset: 0.22,
    shoeKinds: ["wallabee"],
    prizeHint: "20% is on the table. Cash out — or risk it for 25%.",
  },
  "1986": {
    id: "1986",
    year: "1986",
    title: "Crepe & Comfort",
    blurb: "Woodstock, Cape Town. Table Mountain over the brick sheds. Soft as Sunday.",
    background: WOODSTOCK,
    backgrounds: [WOODSTOCK],
    card: "/assets/card-woodstock.jpg",
    hops: 28,
    lives: 3,
    baseGap: 268,
    gapScale: 11,
    baseWidth: 180,
    widthShrink: 3.2,
    minWidth: 112,
    moveAmp: 22,
    moveSpeed: 0.85,
    wind: 20,
    oscillate: false,
    hidePreviewAfter: 3,
    oscSpeed: 1.4,
    sweetPad: 0.038,
    chargeRate: 1.22,
    landInset: 0.22,
    shoeKinds: ["leather"],
    prizeHint: "25% is on the table. Cash out — or risk it for 30%.",
  },
  "1996": {
    id: "1996",
    year: "1996",
    title: "Handmade Heart",
    blurb: "The workshops in Great Brak. Third-generation hands. Outeniqua light.",
    background: WORKSHOPS,
    backgrounds: [WORKSHOPS],
    card: "/assets/card-workshops.jpg",
    hops: 30,
    lives: 2,
    baseGap: 284,
    gapScale: 11.5,
    baseWidth: 168,
    widthShrink: 3.3,
    minWidth: 100,
    moveAmp: 32,
    moveSpeed: 1.05,
    wind: 28,
    oscillate: false,
    hidePreviewAfter: 2,
    oscSpeed: 1.5,
    sweetPad: 0.03,
    chargeRate: 1.28,
    landInset: 0.23,
    shoeKinds: ["tan", "wheat", "cocoa"],
    prizeHint: "30% is on the table. Cash out — or risk it for 35%.",
  },
  "2006": {
    id: "2006",
    year: "2006",
    title: "Street Style",
    blurb: "Long Street, Cape Town. Friday night. Comfort became a look.",
    background: LONGSTREET,
    backgrounds: [LONGSTREET],
    card: "/assets/card-longstreet.jpg",
    hops: 32,
    lives: 2,
    baseGap: 298,
    gapScale: 12,
    baseWidth: 156,
    widthShrink: 3.2,
    minWidth: 90,
    moveAmp: 40,
    moveSpeed: 1.2,
    wind: 34,
    oscillate: true,
    hidePreviewAfter: 1,
    oscSpeed: 1.65,
    sweetPad: 0.024,
    chargeRate: 1.34,
    landInset: 0.24,
    shoeKinds: ["desert"],
    prizeHint: "35% is on the table. Cash out — or risk it for 40%.",
  },
  "2016": {
    id: "2016",
    year: "2016",
    title: "The Revival",
    blurb: "Fynbos on Table Mountain. A new generation found the desert boot.",
    background: TABLEMTN,
    backgrounds: [TABLEMTN],
    card: "/assets/card-tablemountain.jpg",
    hops: 36,
    lives: 2,
    baseGap: 312,
    gapScale: 12.5,
    baseWidth: 144,
    widthShrink: 3,
    minWidth: 80,
    moveAmp: 48,
    moveSpeed: 1.35,
    wind: 42,
    oscillate: true,
    hidePreviewAfter: 0,
    oscSpeed: 1.85,
    sweetPad: 0.018,
    chargeRate: 1.25,
    landInset: 0.24,
    shoeKinds: ["stamp"],
    prizeHint: "40% is on the table. Cash out — or risk it for 50%.",
  },
  "2026": {
    id: "2026",
    year: "2026",
    title: "Sixty",
    blurb: "V&A Waterfront. Table Mountain. Sixty years, one step.",
    background: WATERFRONT,
    backgrounds: [WATERFRONT, LONGSTREET, WOODSTOCK, TABLEMTN],
    card: "/assets/card-waterfront.jpg",
    hops: 40,
    lives: 1,
    baseGap: 326,
    gapScale: 13,
    baseWidth: 132,
    widthShrink: 2.4,
    minWidth: 70,
    moveAmp: 56,
    moveSpeed: 1.5,
    wind: 50,
    oscillate: true,
    hidePreviewAfter: 0,
    oscSpeed: 2.05,
    sweetPad: 0.012,
    chargeRate: 1.32,
    landInset: 0.26,
    shoeKinds: ["sixty"],
    prizeHint: "50% is on the table. Cash out — or risk it for a pair up to R1 000.",
  },
  golden: {
    id: "golden",
    year: "60",
    title: "The Golden Pair",
    blurb: "Blouberg. Table Mountain at gold hour. Risk the 50% for any pair up to R1 000.",
    background: BLOUBERG,
    backgrounds: [BLOUBERG],
    card: "/assets/card-blouberg.jpg",
    hops: 60,
    lives: 1,
    baseGap: 340,
    gapScale: 4.2,
    baseWidth: 118,
    widthShrink: 1.15,
    minWidth: 52,
    moveAmp: 28,
    moveSpeed: 1.55,
    wind: 36,
    oscillate: true,
    hidePreviewAfter: 0,
    oscSpeed: 2.2,
    sweetPad: 0.008,
    chargeRate: 1.4,
    landInset: 0.28,
    shoeKinds: ["gold"],
    prizeHint: "Any pair up to R1 000. Delivery not included. Extremely hard.",
  },
};

export function isDecade(id: LevelId): boolean {
  return id !== "golden";
}

export function nextPlayable(progress: { cashedOut: boolean; pendingDecision: boolean; currentStage: LevelId }): LevelId | null {
  if (progress.cashedOut) return null;
  if (progress.pendingDecision) return null;
  return progress.currentStage;
}
