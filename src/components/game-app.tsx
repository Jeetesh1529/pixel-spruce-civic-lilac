import { useCallback, useEffect, useState } from "react";
import { BrandMark, SixtyBadge } from "@/components/brand-mark";
import { GameStage } from "@/components/game-stage";
import { DECADE_IDS, LADDER, LEVELS, ladderOf } from "@/game/levels";
import {
  applyRun,
  cashOut,
  EMPTY_PROGRESS,
  loadLocalProgress,
  mergeProgress,
  riskNext,
  saveLocalProgress,
} from "@/game/progress";
import type { LevelId, Progress, RunResult } from "@/game/types";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";
import { getMyProgress, recordRun, saveMyProgress } from "@/lib/prizes";

type Screen = "title" | "how" | "select" | "play" | "result" | "prizes" | "terms";

export function GameApp() {
  const { user, isPending } = useCurrentUserState();
  const [screen, setScreen] = useState<Screen>("title");
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [levelId, setLevelId] = useState<LevelId>("1966");
  const [result, setResult] = useState<RunResult | null>(null);
  const [synced, setSynced] = useState(false);
  const [wipedPercent, setWipedPercent] = useState(0);

  useEffect(() => {
    setProgress(loadLocalProgress());
  }, []);

  useEffect(() => {
    if (isPending || !user || synced) return;
    let cancelled = false;
    getMyProgress()
      .then((remote) => {
        if (cancelled) return;
        const local = loadLocalProgress();
        const merged = mergeProgress(local, remote.progress);
        setProgress(merged);
        saveLocalProgress(merged);
        void saveMyProgress({ data: merged }).catch(() => undefined);
        setSynced(true);
      })
      .catch(() => setSynced(true));
    return () => {
      cancelled = true;
    };
  }, [isPending, user, synced]);

  const persist = useCallback(
    (next: Progress) => {
      setProgress(next);
      saveLocalProgress(next);
      if (user) void saveMyProgress({ data: next }).catch(() => undefined);
    },
    [user],
  );

  const handleFinish = useCallback(
    (run: RunResult) => {
      setResult(run);
      setScreen("result");
      const before = progress.stakePercent;
      const next = applyRun(progress, run.levelId, run.won, run.hops, run.score);
      if (!run.won && before > 0 && next.stakePercent === 0 && !progress.cashedOut) {
        setWipedPercent(before);
      } else {
        setWipedPercent(0);
      }
      persist(next);
      if (user) {
        void recordRun({
          data: {
            levelId: run.levelId,
            hops: run.hops,
            completed: run.won,
            perfects: run.perfects,
            score: run.score,
            elapsedMs: run.elapsedMs,
          },
        }).catch(() => undefined);
      }
    },
    [persist, progress, user],
  );

  const startLevel = (id: LevelId) => {
    setLevelId(id);
    setResult(null);
    setWipedPercent(0);
    setScreen("play");
  };

  const handleCashOut = () => {
    const next = cashOut(progress);
    persist(next);
    setScreen("prizes");
  };

  const handleRisk = () => {
    const next = riskNext(progress);
    persist(next);
    startLevel(next.currentStage);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-paper">
      {screen === "play" ? (
        <GameStage
          levelId={levelId}
          stakePercent={progress.stakePercent}
          onExit={() => setScreen("select")}
          onFinish={handleFinish}
        />
      ) : (
        <>
          <TopBar />
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-10 pt-4 sm:px-6">
            {screen === "title" ? (
              <TitleScreen
                onPlay={() => startLevel("1966")}
                onHow={() => setScreen("how")}
                onPrizes={() => setScreen("prizes")}
              />
            ) : null}
            {screen === "how" ? <HowTo onBack={() => setScreen("title")} onPlay={() => startLevel("1966")} /> : null}
            {screen === "select" ? (
              <DecadeSelect
                progress={progress}
                onPick={startLevel}
                onCashOut={handleCashOut}
                onRisk={handleRisk}
                onBack={() => setScreen("title")}
              />
            ) : null}
            {screen === "result" && result ? (
              <ResultScreen
                result={result}
                progress={progress}
                wipedPercent={wipedPercent}
                onReplay={() => startLevel(result.levelId)}
                onSelect={() => setScreen("select")}
                onCashOut={handleCashOut}
                onRisk={handleRisk}
                onClaimPair={() => setScreen("prizes")}
                onRestart={() => startLevel("1966")}
              />
            ) : null}
            {screen === "prizes" ? (
              <PrizesScreen
                progress={progress}
                onBack={() => setScreen(result ? "result" : "title")}
                onTerms={() => setScreen("terms")}
              />
            ) : null}
            {screen === "terms" ? <TermsScreen onBack={() => setScreen("prizes")} /> : null}
          </main>
        </>
      )}
    </div>
  );
}

function TopBar() {
  return (
    <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <BrandMark />
      <a
        href="https://www.grasshoppers.co.za"
        target="_blank"
        rel="noreferrer"
        className="text-sm font-semibold tracking-wide text-paper/70 uppercase underline-offset-4 hover:text-brand hover:underline"
      >
        Shop
      </a>
    </header>
  );
}

function TitleScreen({
  onPlay,
  onHow,
  onPrizes,
}: {
  onPlay: () => void;
  onHow: () => void;
  onPrizes: () => void;
}) {
  return (
    <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative overflow-hidden bg-surface">
        <img
          src="/assets/title-hero.jpg"
          alt="Hopper campaign still — low-angle leap in desert boots"
          className="aspect-[4/3] w-full object-cover object-top sm:aspect-[16/11]"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-5">
          <p className="text-xs font-semibold tracking-[0.28em] text-brand uppercase">1966 — 2026</p>
          <p className="mt-1 font-display text-3xl uppercase text-paper sm:text-4xl">The most comfy step.</p>
        </div>
        <SixtyBadge className="absolute top-4 right-4" />
      </div>
      <div className="flex flex-col justify-center">
        <img src="/assets/logo-60.png" alt="60 years since 1966" className="mb-6 w-full max-w-md" />
        <p className="text-sm font-semibold tracking-[0.28em] text-brand uppercase">Official birthday game</p>
        <h1 className="mt-2 font-display text-7xl leading-[0.88] text-paper uppercase sm:text-8xl">
          Hopper
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-paper/70">
          Walk a decade. Bank a discount. Cash out — or put it all on the next pair. Fail, and the voucher burns.
          Clear 2026 and you can risk 50% for any Grasshopper up to R1 000.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onPlay}
            className="h-12 bg-brand px-8 text-base font-semibold tracking-wide text-ink uppercase hover:bg-paper"
          >
            Play
          </button>
          <button
            type="button"
            onClick={onHow}
            className="h-12 border border-paper/25 px-6 text-base font-semibold tracking-wide text-paper uppercase hover:border-brand hover:text-brand"
          >
            How to play
          </button>
          <button
            type="button"
            onClick={onPrizes}
            className="h-12 px-5 text-base font-semibold tracking-wide text-paper/70 uppercase underline-offset-4 hover:text-brand hover:underline"
          >
            The ladder
          </button>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted">
          Handmade in Great Brak River. One claim per person. Delivery on a free pair is extra.
        </p>
      </div>
    </section>
  );
}

function HowTo({ onBack, onPlay }: { onBack: () => void; onPlay: () => void }) {
  const steps = [
    {
      n: "01",
      t: "Charge the hop",
      d: "Hold anywhere (or the space bar). The meter fills fast. Later decades swing — release in the yellow band.",
    },
    {
      n: "02",
      t: "Land on the crepe",
      d: "Every platform is a real Grasshoppers pair. Hit the sole. Miss, and you lose a life. Later decades move, blow, and hide the preview.",
    },
    {
      n: "03",
      t: "Cash out or risk it",
      d: "1966 pays 15%. Take the coupon and leave — or stake it for 20% in 1976. Each decade raises the discount. Fail after you leverage, and you start again from 1966 with nothing.",
    },
    {
      n: "04",
      t: "The Golden Pair",
      d: "Clear 2026 for 50%. Risk that 50% on sixty hops, one life. Win any Grasshopper up to R1 000. Delivery not included.",
    },
  ];
  return (
    <section className="mx-auto max-w-2xl py-4">
      <button type="button" onClick={onBack} className="text-sm font-semibold tracking-wide text-paper/70 uppercase">
        ← Back
      </button>
      <h2 className="mt-4 font-display text-5xl text-paper uppercase">How to play</h2>
      <ol className="mt-8 space-y-4">
        {steps.map((s) => (
          <li key={s.n} className="flex gap-4 border border-line bg-surface p-5">
            <span className="font-display text-3xl text-brand">{s.n}</span>
            <div>
              <h3 className="font-display text-2xl text-paper uppercase">{s.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-paper/70">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onPlay}
        className="mt-8 h-12 bg-brand px-8 font-semibold tracking-wide text-ink uppercase hover:bg-paper"
      >
        Play
      </button>
    </section>
  );
}

function DecadeSelect({
  progress,
  onPick,
  onCashOut,
  onRisk,
  onBack,
}: {
  progress: Progress;
  onPick: (id: LevelId) => void;
  onCashOut: () => void;
  onRisk: () => void;
  onBack: () => void;
}) {
  return (
    <section>
      <button type="button" onClick={onBack} className="text-sm font-semibold tracking-wide text-paper/70 uppercase">
        ← Home
      </button>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-5xl text-paper uppercase">Walk the decades</h2>
          <p className="mt-1 text-sm text-paper/70">
            {progress.cashedOut
              ? `Cashed out at ${progress.cashedPercent}% — play for pride`
              : progress.goldenDone
                ? "The Golden Pair is yours"
                : progress.pendingDecision
                  ? `${progress.stakePercent}% is sitting on the table. Cash out or risk the next decade.`
                  : progress.stakePercent > 0
                    ? `${progress.stakePercent}% is at risk on ${progress.currentStage}`
                    : "Start at 1966. Each decade you clear, the discount goes up."}
          </p>
        </div>
      </div>

      {progress.pendingDecision && !progress.cashedOut ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-brand bg-surface p-4">
          <p className="text-sm text-paper">
            <span className="font-display text-2xl text-brand">{progress.stakePercent}%</span> voucher waiting. Leave
            with it, or put it up for{" "}
            {progress.currentStage === "golden"
              ? "the pair"
              : progress.currentStage === "2026"
                ? "a pair up to R1 000"
                : `${LADDER[progress.currentStage].nextPercent}%`}
            .
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onCashOut}
              className="h-11 bg-brand px-5 text-sm font-semibold tracking-wide text-ink uppercase"
            >
              Cash out {progress.stakePercent}%
            </button>
            <button
              type="button"
              onClick={onRisk}
              className="h-11 border border-paper/25 px-5 text-sm font-semibold tracking-wide text-paper uppercase"
            >
              Risk it
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {DECADE_IDS.map((id) => {
          const lvl = LEVELS[id];
          const step = LADDER[id];
          const done = progress.decades.includes(id);
          const current = progress.currentStage === id && !progress.pendingDecision && !progress.cashedOut;
          const locked = !progress.cashedOut && !progress.goldenDone && !current;
          return (
            <button
              key={id}
              type="button"
              disabled={locked}
              onClick={() => !locked && onPick(id)}
              className={cn(
                "group overflow-hidden text-left ring-1 transition",
                locked ? "cursor-not-allowed bg-surface text-muted ring-line opacity-60" : "bg-surface ring-line hover:-translate-y-0.5",
                current && "ring-brand",
              )}
            >
              <div className="relative h-32 overflow-hidden">
                <img src={lvl.card} alt="" className="h-full w-full object-cover object-top transition group-hover:scale-105" />
                <span className="absolute top-3 left-3 bg-ink/80 px-2.5 py-1 text-xs font-semibold tracking-wider text-brand uppercase">
                  {lvl.year}
                </span>
                <span className="absolute top-3 right-3 bg-ink/80 px-2.5 py-1 text-xs font-semibold tracking-wide text-paper uppercase">
                  {done ? `${step.percent}% banked` : locked ? "Locked" : `${step.percent}% if you clear`}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-2xl text-paper uppercase">{lvl.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-paper/70">{lvl.blurb}</p>
                <p className="mt-2 text-xs font-semibold tracking-[0.16em] text-brand uppercase">
                  {lvl.hops} hops · {lvl.lives} {lvl.lives === 1 ? "life" : "lives"}
                </p>
              </div>
            </button>
          );
        })}
        <GoldenCard progress={progress} onPick={onPick} />
      </div>
    </section>
  );
}

function GoldenCard({ progress, onPick }: { progress: Progress; onPick: (id: LevelId) => void }) {
  const open = progress.currentStage === "golden" && !progress.cashedOut && !progress.pendingDecision;
  const won = progress.goldenDone;
  return (
    <button
      type="button"
      disabled={!open && !won && !progress.cashedOut}
      onClick={() => (open || progress.cashedOut || won) && onPick("golden")}
      className={cn(
        "overflow-hidden text-left ring-1 transition sm:col-span-2",
        open || won ? "bg-ink text-paper ring-brand hover:-translate-y-0.5" : "cursor-not-allowed bg-surface text-muted ring-line",
      )}
    >
      <div className="grid gap-0 sm:grid-cols-[16rem_1fr]">
        <img src="/assets/card-blouberg.jpg" alt="" className="h-32 w-full object-cover sm:h-full" />
        <div className="p-5">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand uppercase">Finale · 50% at risk</p>
          <h3 className="mt-1 font-display text-3xl text-brand uppercase">The Golden Pair</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/70">
            Sixty hops. One life. Put the 50% on the line for any Grasshopper up to R1 000. Delivery not included.
          </p>
          <p className="mt-3 text-xs font-semibold tracking-wide uppercase">
            {won ? "Won" : open ? "Unlocked — if you dare" : "Clear 2026 and risk the 50% to unlock"}
          </p>
        </div>
      </div>
    </button>
  );
}

function ResultScreen({
  result,
  progress,
  wipedPercent,
  onReplay,
  onSelect,
  onCashOut,
  onRisk,
  onClaimPair,
  onRestart,
}: {
  result: RunResult;
  progress: Progress;
  wipedPercent: number;
  onReplay: () => void;
  onSelect: () => void;
  onCashOut: () => void;
  onRisk: () => void;
  onClaimPair: () => void;
  onRestart: () => void;
}) {
  const lvl = LEVELS[result.levelId];
  const step = ladderOf(result.levelId);
  const deciding = result.won && progress.pendingDecision && step && !progress.cashedOut;
  const pairWon = result.won && result.levelId === "golden";

  return (
    <section className="mx-auto w-full max-w-xl py-4">
      <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">{lvl.year}</p>
      <h2 className="mt-1 font-display text-5xl text-paper uppercase">
        {result.won ? (pairWon ? "The pair is yours" : "Decade walked") : wipedPercent ? "Voucher burned" : "Sole missed"}
      </h2>
      <p className="mt-2 text-paper/70">
        {result.won
          ? pairWon
            ? "Any Grasshopper up to R1 000. Delivery is on you."
            : lvl.blurb
          : wipedPercent
            ? `You put ${wipedPercent}% on the line and missed. The run resets at 1966.`
            : "The crepe is unforgiving. Charge again."}
      </p>
      <dl className="mt-6 grid grid-cols-3 gap-2">
        <ScoreCell label="Hops" value={`${result.hops}/${result.total}`} />
        <ScoreCell label="Perfects" value={String(result.perfects)} />
        <ScoreCell label="Score" value={String(result.score)} />
      </dl>

      {deciding && step ? (
        <div className="mt-6 border border-brand bg-surface p-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">On the table</p>
          <p className="mt-1 font-display text-5xl text-brand">{step.percent}%</p>
          <p className="mt-2 text-sm leading-relaxed text-paper/70">
            Leave now with {step.percent}% off. Or put it up — fail the next decade and you start from 1966 with nothing.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onCashOut}
              className="h-12 flex-1 bg-brand px-5 text-sm font-semibold tracking-wide text-ink uppercase"
            >
              Cash out {step.percent}%
            </button>
            <button
              type="button"
              onClick={onRisk}
              className="h-12 flex-1 border border-paper/25 px-5 text-sm font-semibold tracking-wide text-paper uppercase"
            >
              {step.nextPercent === "pair"
                ? "Risk it for a pair · R1 000"
                : `Risk it for ${step.nextPercent}%`}
            </button>
          </div>
        </div>
      ) : null}

      {pairWon ? (
        <div className="mt-6 border border-brand bg-ink p-4">
          <p className="font-display text-2xl text-brand uppercase">The Golden Pair</p>
          <p className="mt-1 text-sm text-paper/70">Any style up to R1 000. Delivery extra. Claims open when we launch.</p>
          <button
            type="button"
            onClick={onClaimPair}
            className="mt-3 h-11 bg-brand px-5 text-sm font-semibold tracking-wide text-ink uppercase"
          >
            See the ladder
          </button>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {wipedPercent ? (
          <button type="button" onClick={onRestart} className="h-11 bg-brand px-5 text-sm font-semibold tracking-wide text-ink uppercase">
            Start again at 1966
          </button>
        ) : !deciding && !pairWon ? (
          <button type="button" onClick={onReplay} className="h-11 bg-paper px-5 text-sm font-semibold tracking-wide text-ink uppercase">
            Try again
          </button>
        ) : null}
        <button
          type="button"
          onClick={onSelect}
          className="h-11 border border-paper/25 px-5 text-sm font-semibold tracking-wide text-paper uppercase"
        >
          Decades
        </button>
      </div>
    </section>
  );
}

function ScoreCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-surface px-3 py-3 text-center">
      <p className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">{label}</p>
      <p className="font-display text-2xl tabular-nums text-paper">{value}</p>
    </div>
  );
}

function PrizesScreen({
  progress,
  onBack,
  onTerms,
}: {
  progress: Progress;
  onBack: () => void;
  onTerms: () => void;
}) {
  return (
    <section className="mx-auto w-full max-w-2xl py-2">
      <button type="button" onClick={onBack} className="text-sm font-semibold tracking-wide text-paper/70 uppercase">
        ← Back
      </button>
      <h2 className="mt-3 font-display text-5xl text-paper uppercase">The leverage ladder</h2>
      <p className="mt-2 text-sm leading-relaxed text-paper/70">
        Clear a decade, then choose: take the discount and walk, or stake it on the next pair. This preview is for
        play — voucher claims open when we launch.
      </p>
      <ol className="mt-5 grid gap-2 sm:grid-cols-2">
        {(
          [
            ["1966", "15%"],
            ["1976", "20%"],
            ["1986", "25%"],
            ["1996", "30%"],
            ["2006", "35%"],
            ["2016", "40%"],
            ["2026", "50%"],
            ["Finale", "Pair · R1 000"],
          ] as const
        ).map(([year, prize]) => (
          <li key={year} className="flex items-center justify-between border border-line bg-surface px-3 py-2">
            <span className="text-xs font-semibold tracking-wide text-paper/70 uppercase">{year}</span>
            <span className="font-display text-xl text-brand">{prize}</span>
          </li>
        ))}
      </ol>
      {progress.cashedOut ? (
        <p className="mt-6 border border-brand bg-surface p-4 text-sm text-paper/70">
          You cashed out at <span className="font-semibold text-brand">{progress.cashedPercent}%</span>. On launch this
          becomes a shop voucher.
        </p>
      ) : null}
      {progress.goldenDone ? (
        <p className="mt-3 border border-brand bg-surface p-4 text-sm text-paper/70">
          The Golden Pair is cleared. On launch that is any Grasshopper up to R1 000 — delivery extra.
        </p>
      ) : null}
      <button type="button" onClick={onTerms} className="mt-6 text-xs text-muted underline-offset-2 hover:underline">
        Prize terms
      </button>
    </section>
  );
}

function TermsScreen({ onBack }: { onBack: () => void }) {
  return (
    <article className="mx-auto max-w-2xl py-2 text-sm leading-relaxed text-paper/70">
      <button type="button" onClick={onBack} className="text-sm font-semibold tracking-wide text-paper/70 uppercase">
        ← Prizes
      </button>
      <h2 className="mt-3 font-display text-4xl text-paper uppercase">Prize terms</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5">
        <li>Hopper is the official 60th birthday game for Grasshoppers South Africa.</li>
        <li>Decades are played in order. Clear 1966 for 15% off. Cash out, or risk that voucher on the next decade.</li>
        <li>Ladder: 15% → 20% → 25% → 30% → 35% → 40% → 50%. Fail after you leverage and the run resets at 1966.</li>
        <li>Clear 2026 and you may risk the 50% on The Golden Pair for any Grasshopper up to R1 000. Delivery is not included.</li>
        <li>One claim per person. You must be 18+ and a South African resident.</li>
        <li>This board preview is play-only. Claims will be fulfilled after launch, once we verify the run.</li>
        <li>Vouchers apply on grasshoppers.co.za and cannot be exchanged for cash. Stock and staff decision are final.</li>
      </ul>
    </article>
  );
}
