import type { LevelId, Progress } from "./types";
import { DECADE_IDS, LADDER } from "./levels";

const KEY = "gh60-progress-v3";

export const EMPTY_PROGRESS: Progress = {
  decades: [],
  currentStage: "1966",
  stakePercent: 0,
  cashedPercent: 0,
  cashedOut: false,
  pendingDecision: false,
  goldenBest: 0,
  goldenDone: false,
  bestScore: 0,
};

function isLevelId(v: unknown): v is LevelId {
  return (
    v === "1966" ||
    v === "1976" ||
    v === "1986" ||
    v === "1996" ||
    v === "2006" ||
    v === "2016" ||
    v === "2026" ||
    v === "golden"
  );
}

export function loadLocalProgress(): Progress {
  if (typeof window === "undefined") return { ...EMPTY_PROGRESS };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      decades: Array.isArray(parsed.decades) ? parsed.decades.filter(isLevelId).filter((id) => id !== "golden") : [],
      currentStage: isLevelId(parsed.currentStage) ? parsed.currentStage : "1966",
      stakePercent: Number(parsed.stakePercent) || 0,
      cashedPercent: Number(parsed.cashedPercent) || 0,
      cashedOut: Boolean(parsed.cashedOut),
      pendingDecision: Boolean(parsed.pendingDecision),
      goldenBest: Number(parsed.goldenBest) || 0,
      goldenDone: Boolean(parsed.goldenDone),
      bestScore: Number(parsed.bestScore) || 0,
    };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function saveLocalProgress(p: Progress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

function stageRank(id: LevelId) {
  if (id === "golden") return DECADE_IDS.length;
  return Math.max(0, DECADE_IDS.indexOf(id));
}

export function mergeProgress(a: Progress, b: Progress): Progress {
  if (a.cashedOut || b.cashedOut) {
    const keep = a.cashedPercent >= b.cashedPercent ? a : b;
    return {
      ...keep,
      cashedOut: true,
      cashedPercent: Math.max(a.cashedPercent, b.cashedPercent),
      stakePercent: 0,
      pendingDecision: false,
      goldenBest: Math.max(a.goldenBest, b.goldenBest),
      goldenDone: a.goldenDone || b.goldenDone,
      bestScore: Math.max(a.bestScore, b.bestScore),
    };
  }
  if (a.goldenDone || b.goldenDone) {
    const keep = a.goldenDone ? a : b;
    return {
      ...keep,
      goldenDone: true,
      goldenBest: Math.max(a.goldenBest, b.goldenBest),
      bestScore: Math.max(a.bestScore, b.bestScore),
    };
  }
  const further = a.stakePercent > b.stakePercent || (a.stakePercent === b.stakePercent && stageRank(a.currentStage) >= stageRank(b.currentStage)) ? a : b;
  return {
    ...further,
    goldenBest: Math.max(a.goldenBest, b.goldenBest),
    bestScore: Math.max(a.bestScore, b.bestScore),
  };
}

export function applyRun(p: Progress, levelId: LevelId, won: boolean, hops: number, score: number): Progress {
  const next: Progress = {
    ...p,
    decades: [...p.decades],
    bestScore: Math.max(p.bestScore, score),
  };

  if (levelId === "golden") {
    next.goldenBest = Math.max(next.goldenBest, hops);
    if (won) {
      next.goldenDone = true;
      next.stakePercent = 0;
      next.pendingDecision = false;
    } else if (!p.cashedOut && p.stakePercent > 0) {
      return wipeRun(next, score);
    }
    return next;
  }

  if (p.cashedOut || p.goldenDone) {
    return next;
  }

  if (won) {
    if (!next.decades.includes(levelId)) next.decades.push(levelId);
    const step = LADDER[levelId];
    next.stakePercent = step.percent;
    next.currentStage = levelId;
    next.pendingDecision = true;
    return next;
  }

  if (p.stakePercent > 0) {
    return wipeRun(next, score);
  }

  return next;
}

export function cashOut(p: Progress): Progress {
  if (p.cashedOut || p.goldenDone || p.stakePercent <= 0) return p;
  return {
    ...p,
    cashedOut: true,
    cashedPercent: p.stakePercent,
    stakePercent: 0,
    pendingDecision: false,
  };
}

export function riskNext(p: Progress): Progress {
  if (p.cashedOut || p.goldenDone || !p.pendingDecision) return p;
  const stage = p.currentStage;
  if (stage === "golden") return p;
  const step = LADDER[stage];
  return {
    ...p,
    currentStage: step.next,
    pendingDecision: false,
  };
}

export function wipeRun(p: Progress, score = p.bestScore): Progress {
  return {
    ...EMPTY_PROGRESS,
    bestScore: Math.max(p.bestScore, score),
    goldenBest: p.goldenBest,
    cashedOut: p.cashedOut,
    cashedPercent: p.cashedPercent,
    goldenDone: p.goldenDone,
  };
}

export function earnedTiers(p: Progress): { discount: number; golden: boolean; cashed: boolean } {
  return {
    discount: p.cashedOut ? p.cashedPercent : 0,
    golden: p.goldenDone,
    cashed: p.cashedOut,
  };
}
