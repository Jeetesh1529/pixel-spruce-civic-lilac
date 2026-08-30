import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { LevelId, PrizeTier, Progress } from "@/game/types";

const STAGES: LevelId[] = ["1966", "1976", "1986", "1996", "2006", "2016", "2026", "golden"];
const DISCOUNTS = new Set(["15", "20", "25", "30", "35", "40", "50"]);

function parseDecades(raw: string | null | undefined): LevelId[] {
  try {
    const v = JSON.parse(raw || "[]") as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((id): id is LevelId => typeof id === "string" && STAGES.includes(id as LevelId) && id !== "golden");
  } catch {
    return [];
  }
}

function parseStage(raw: string | null | undefined): LevelId {
  return raw && STAGES.includes(raw as LevelId) ? (raw as LevelId) : "1966";
}

function makeCode(tier: PrizeTier) {
  const prefix = tier === "golden" ? "PAIR" : `D${tier}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let i = 0; i < 6; i++) tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `GH60-${prefix}-${tail}`;
}

function rowToProgress(row: {
  decades_completed: string;
  golden_best_hop: number;
  golden_completed: boolean;
  best_score: number;
  current_stage?: string;
  stake_percent?: number;
  cashed_percent?: number;
  cashed_out?: boolean;
  pending_decision?: boolean;
} | undefined): Progress {
  if (!row) {
    return {
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
  }
  return {
    decades: parseDecades(row.decades_completed),
    currentStage: parseStage(row.current_stage),
    stakePercent: Number(row.stake_percent) || 0,
    cashedPercent: Number(row.cashed_percent) || 0,
    cashedOut: Boolean(row.cashed_out),
    pendingDecision: Boolean(row.pending_decision),
    goldenBest: row.golden_best_hop,
    goldenDone: row.golden_completed,
    bestScore: row.best_score,
  };
}

export const getMyProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      decades_completed: string;
      golden_best_hop: number;
      golden_completed: boolean;
      best_score: number;
      current_stage: string;
      stake_percent: number;
      cashed_percent: number;
      cashed_out: boolean;
      pending_decision: boolean;
    }>`
      select decades_completed, golden_best_hop, golden_completed, best_score,
             current_stage, stake_percent, cashed_percent, cashed_out, pending_decision
      from player_progress
      where user_id = ${context.userId}
    `;

    const claims = await sql<{ prize_tier: string; code: string; status: string }>`
      select prize_tier, code, status from prize_claims where user_id = ${context.userId}
    `;

    return { progress: rowToProgress(rows[0]), claims };
  });

export const saveMyProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Progress) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const decades = JSON.stringify(data.decades);
    await sql`
      insert into player_progress (
        user_id, decades_completed, golden_best_hop, golden_completed, best_score,
        current_stage, stake_percent, cashed_percent, cashed_out, pending_decision, updated_at
      )
      values (
        ${context.userId}, ${decades}, ${data.goldenBest}, ${data.goldenDone}, ${data.bestScore},
        ${data.currentStage}, ${data.stakePercent}, ${data.cashedPercent}, ${data.cashedOut}, ${data.pendingDecision}, now()
      )
      on conflict (user_id) do update set
        decades_completed = excluded.decades_completed,
        golden_best_hop = excluded.golden_best_hop,
        golden_completed = excluded.golden_completed,
        best_score = excluded.best_score,
        current_stage = excluded.current_stage,
        stake_percent = excluded.stake_percent,
        cashed_percent = excluded.cashed_percent,
        cashed_out = excluded.cashed_out,
        pending_decision = excluded.pending_decision,
        updated_at = now()
    `;
    return { ok: true as const };
  });

export const recordRun = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      levelId: string;
      hops: number;
      completed: boolean;
      perfects: number;
      score: number;
      elapsedMs: number;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into game_runs (user_id, level_id, hops, completed, perfects, score, elapsed_ms)
      values (
        ${context.userId},
        ${data.levelId},
        ${data.hops},
        ${data.completed},
        ${data.perfects},
        ${data.score},
        ${data.elapsedMs}
      )
    `;
    return { ok: true as const };
  });

export const submitClaim = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      prizeTier: PrizeTier;
      fullName: string;
      email: string;
      phone?: string;
      shoeStyle?: string;
      shoeSize?: string;
    }) => {
      const fullName = input.fullName.trim();
      const email = input.email.trim();
      if (fullName.length < 2) throw new Error("Please enter your name");
      if (!email.includes("@")) throw new Error("Please enter a valid email");
      return { ...input, fullName, email };
    },
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{
      cashed_out: boolean;
      cashed_percent: number;
      golden_completed: boolean;
    }>`
      select cashed_out, cashed_percent, golden_completed
      from player_progress
      where user_id = ${context.userId}
    `;
    const row = rows[0];
    const eligible =
      data.prizeTier === "golden"
        ? Boolean(row?.golden_completed)
        : Boolean(row?.cashed_out) && String(row?.cashed_percent) === data.prizeTier && DISCOUNTS.has(data.prizeTier);

    if (!eligible) {
      throw new Error("That prize is not on your account. Cash out a decade first — or finish The Golden Pair.");
    }

    const existing = await sql<{ code: string; status: string }>`
      select code, status from prize_claims
      where user_id = ${context.userId}
    `;
    if (existing[0]) {
      return { code: existing[0].code, status: existing[0].status, already: true as const };
    }

    const code = makeCode(data.prizeTier);
    const discount = data.prizeTier === "golden" ? null : Number(data.prizeTier);
    await sql`
      insert into prize_claims (
        user_id, prize_tier, code, full_name, email, phone, shoe_style, shoe_size, discount_percent
      ) values (
        ${context.userId},
        ${data.prizeTier},
        ${code},
        ${data.fullName},
        ${data.email},
        ${data.phone ?? null},
        ${data.shoeStyle ?? null},
        ${data.shoeSize ?? null},
        ${discount}
      )
    `;
    return { code, status: "pending", already: false as const };
  });

export const listMyClaims = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      prize_tier: string;
      code: string;
      status: string;
      shoe_style: string | null;
      created_at: string;
    }>`
      select prize_tier, code, status, shoe_style, created_at
      from prize_claims
      where user_id = ${context.userId}
      order by created_at desc
    `;
  });
