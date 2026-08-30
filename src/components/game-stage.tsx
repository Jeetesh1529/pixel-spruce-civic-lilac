import { useEffect, useRef, useState } from "react";
import { HopAudio } from "@/game/audio";
import { loadGameImages } from "@/game/assets";
import { HopEngine } from "@/game/engine";
import { LEVELS } from "@/game/levels";
import type { HudSnap, LevelId, RunResult } from "@/game/types";
import { cn } from "@/lib/cn";

export function GameStage({
  levelId,
  stakePercent = 0,
  onExit,
  onFinish,
}: {
  levelId: LevelId;
  stakePercent?: number;
  onExit: () => void;
  onFinish: (result: RunResult) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HopEngine | null>(null);
  const audioRef = useRef(new HopAudio());
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hud, setHud] = useState<HudSnap | null>(null);
  const [muted, setMuted] = useState(false);
  const level = LEVELS[levelId];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dead = false;
    const audio = audioRef.current;
    loadGameImages()
      .then((images) => {
        if (dead) return;
        const engine = new HopEngine(canvas, images, level, audio, {
          onFinish: (r) => finishRef.current(r),
          onHud: setHud,
        });
        engineRef.current = engine;
        engine.start();
        setReady(true);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not load the game");
      });

    const onResize = () => engineRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      dead = true;
      window.removeEventListener("resize", onResize);
      engineRef.current?.stop();
      engineRef.current = null;
    };
  }, [level]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        engineRef.current?.pointerDown();
      }
      if (e.code === "Escape") onExit();
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        engineRef.current?.pointerUp();
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onExit]);

  return (
    <div className="relative flex min-h-dvh min-h-0 flex-1 flex-col bg-ink">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onExit}
            className="h-10 bg-ink/75 px-4 text-sm font-semibold tracking-wide text-paper uppercase backdrop-blur-sm hover:bg-ink"
          >
            Exit
          </button>
          <button
            type="button"
            onClick={() => {
              audioRef.current.muted = !audioRef.current.muted;
              setMuted(audioRef.current.muted);
            }}
            className="h-10 bg-ink/75 px-3 text-sm font-semibold tracking-wide text-paper uppercase backdrop-blur-sm hover:bg-ink"
          >
            {muted ? "Sound off" : "Sound on"}
          </button>
        </div>
        <div className="bg-ink/75 px-3 py-2 text-right text-paper backdrop-blur-sm">
          <p className="font-display text-xl leading-none uppercase">{level.year}</p>
          <p className="mt-0.5 text-[0.7rem] tracking-wide text-brand uppercase">{level.title}</p>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-16 z-10 flex justify-center px-3 sm:top-20">
        <div className="flex items-center gap-4 bg-ink/70 px-4 py-2 text-paper backdrop-blur-sm">
          <Stat label="Hop" value={`${hud?.hop ?? 0}/${level.hops}`} gold={levelId === "golden"} />
          <Stat label="Lives" value={String(hud?.lives ?? level.lives)} />
          <Stat label="Score" value={String(hud?.score ?? 0)} />
          {stakePercent > 0 ? <Stat label="At risk" value={`${stakePercent}%`} gold /> : null}
        </div>
      </div>

      {hud?.message ? (
        <p className="pointer-events-none absolute inset-x-0 top-[7.5rem] z-10 text-center font-display text-2xl text-brand uppercase drop-shadow sm:text-3xl">
          {hud.message}
        </p>
      ) : null}

      <div
        className="relative min-h-0 flex-1 touch-none"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          engineRef.current?.pointerDown();
        }}
        onPointerUp={() => engineRef.current?.pointerUp()}
        onPointerCancel={() => engineRef.current?.pointerUp()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
        {!ready && !error ? (
          <div className="absolute inset-0 grid place-items-center bg-ink text-paper">
            <p className="font-display text-3xl uppercase">Warming the crepe soles…</p>
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-0 grid place-items-center bg-ink p-6 text-center text-paper">
            <p>{error}</p>
          </div>
        ) : null}
      </div>

      <p className="pointer-events-none absolute inset-x-0 bottom-3 z-10 text-center text-xs font-medium tracking-wide text-paper/85 uppercase sm:bottom-5">
        Hold to charge · release to hop · land on the crepe sole
      </p>
    </div>
  );
}

function Stat({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="min-w-[3.4rem] text-center">
      <p className="text-[0.62rem] tracking-[0.16em] text-paper/60 uppercase">{label}</p>
      <p className={cn("font-display text-lg tabular-nums leading-none", gold && "text-brand")}>{value}</p>
    </div>
  );
}
